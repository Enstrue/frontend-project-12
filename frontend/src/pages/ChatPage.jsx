import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import leoProfanity from 'leo-profanity';
import { Modal, Button, Dropdown, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  fetchChatData,
  sendMessage,
  addNewChannel,
  removeExistingChannel,
  renameExistingChannel,
} from '../store/chatSlice';

const CustomToast = ({ message }) => (
  <div>
    <div>{message}</div>
  </div>
);

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username);
  const {
    channels, messages, status, error,
  } = useSelector((state) => state.chat);

  const [currentChannel, setCurrentChannel] = useState('');
  const [modalType, setModalType] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const defaultChannelId = channels[0]?.id || '';
  const isInitialRender = useRef(true);

  // Добавляем рефы для прокрутки
  const messagesBoxRef = useRef(null);
  const channelsBoxRef = useRef(null);

  // Состояние для отслеживания прокрутки
  const isUserScrollingMessages = useRef(false);
  const isUserScrollingChannels = useRef({});
  const lastScrollTopMessages = useRef(0); // Для сообщений
  const lastScrollTopChannels = useRef({}); // Для каналов

  // Обработчик прокрутки для сообщений
  const handleScrollMessages = () => {
    if (messagesBoxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesBoxRef.current;
      isUserScrollingMessages.current = scrollTop < scrollHeight - clientHeight - 10;
      lastScrollTopMessages.current = scrollTop;
    }
  };

  // Обработчик прокрутки для каналов
  const handleScrollChannels = (channelId) => {
    const channelRef = channelsBoxRef.current[channelId];
    if (channelRef) {
      const { scrollTop, scrollHeight, clientHeight } = channelRef;
      isUserScrollingChannels.current[channelId] = scrollTop < scrollHeight - clientHeight - 10;
      lastScrollTopChannels.current[channelId] = scrollTop;
    }
  };

  useEffect(() => {
    leoProfanity.loadDictionary('ru');
    leoProfanity.loadDictionary('en');
    dispatch(fetchChatData())
      .then(() => {
        if (channels.length > 0 && isInitialRender.current) {
          setCurrentChannel(channels.find((channel) => channel.name === 'general')?.id || defaultChannelId);
          isInitialRender.current = false;
        }
      })
      .catch(() => {
        toast.error(t('chat.notifications.fetchError'));
      });
  }, [dispatch, t, channels, defaultChannelId]);

  useEffect(() => {
    // Прокручиваем в самый низ, если пользователь не прокручивает вручную (для сообщений)
    if (!isUserScrollingMessages.current && messagesBoxRef.current) {
      const { scrollHeight, clientHeight } = messagesBoxRef.current;
      messagesBoxRef.current.scrollTop = scrollHeight - clientHeight; // Прокручиваем в самый низ
    }
  }, [messages, currentChannel]);

  // Прокручиваем канал в самый низ, если пользователь не прокручивает вручную
  useEffect(() => {
    if (channelsBoxRef.current && !isUserScrollingChannels.current[currentChannel]) {
      const channelRef = channelsBoxRef.current[currentChannel];
      if (channelRef) {
        const { scrollHeight, clientHeight } = channelRef;
        channelRef.scrollTop = scrollHeight - clientHeight; // Прокручиваем в самый низ
      }
    }
  }, [channels, currentChannel]);

  useEffect(() => {
    // Прокручиваем в самый низ при смене канала
    if (messagesBoxRef.current) {
      const { scrollHeight, clientHeight } = messagesBoxRef.current;
      messagesBoxRef.current.scrollTop = scrollHeight - clientHeight; // Прокручиваем в самый низ
    }
  }, [currentChannel]);

  const handleChannelChange = (channelId) => {
    setCurrentChannel(channelId);
  };

  const handleSendMessage = (messageBody) => {
    if (currentChannel) {
      const cleanedMessage = leoProfanity.clean(messageBody);
      dispatch(sendMessage({
        channelId: currentChannel,
        body: cleanedMessage,
        username,
        timestamp: new Date().toISOString(),
      }))
        .catch(() => {
          toast.error(t('chat.notifications.networkError'));
        });
    }
  };

  const isProtectedChannel = (channel) => ['general', 'random'].includes(channel.name);

  const handleAddChannel = async (values, { resetForm }) => {
    try {
      const cleanedName = leoProfanity.clean(values.name);
      const newChannel = await dispatch(addNewChannel(cleanedName)).unwrap();
      if (username) {
        setCurrentChannel(newChannel.id);
      }
      toast.success(<CustomToast message={t('chat.notifications.channelCreated')} />);
      resetForm();
      setModalType(null);
    } catch {
      toast.error(t('chat.notifications.networkError'));
    }
  };

  const handleRemoveChannel = async () => {
    try {
      if (
        selectedChannel
        && selectedChannel.id !== defaultChannelId
        && !isProtectedChannel(selectedChannel)
      ) {
        await dispatch(removeExistingChannel(selectedChannel.id)).unwrap();
        toast.success(t('chat.notifications.channelDeleted'));
        setCurrentChannel(defaultChannelId);
        setModalType(null);
      } else {
        toast.error(t('chat.notifications.protectedChannelDeleteError'));
      }
    } catch {
      toast.error(t('chat.notifications.networkError'));
    }
  };

  const handleRenameChannel = async (newName) => {
    try {
      if (
        selectedChannel
        && !isProtectedChannel(selectedChannel)
      ) {
        const cleanedName = leoProfanity.clean(newName);
        await dispatch(
          renameExistingChannel({
            id: selectedChannel.id,
            name: cleanedName,
          }),
        ).unwrap();
        toast.success(t('chat.notifications.channelRenamed'));
        setModalType(null);
      } else {
        toast.error(t('chat.notifications.protectedChannelRenameError'));
      }
    } catch {
      toast.error(t('chat.notifications.networkError'));
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('validation.username'))
      .max(20, t('validation.username'))
      .required(t('signup.validation.required'))
      .test('unique', t('validation.unique'), (value) => !channels.some((channel) => channel.name === value)),
  });

  // // Если статус "loading", отображаем спиннер
  // if (status === 'loading') {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center w-100 h-100">
  //       <Spinner animation="border" variant="primary" />
  //     </div>
  //   );
  // }

  return (
    <div className="container h-100 overflow-hidden">
      <ToastContainer position="top-right" autoClose={300} />
      <div className="row h-100 bg-white flex-md-row">
        {/* Left side - Channel list */}
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <button
              type="button"
              className="p-0 text-primary btn btn-group-vertical"
              onClick={() => setModalType('add')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>

          {status === 'failed' && (
            <p className="text-danger">
              {t('error')}
              :
              {' '}
              {error}
            </p>
          )}
          <ul
            ref={channelsBoxRef} // Добавляем реф для каналов
            onScroll={handleScrollChannels} // Слушаем прокрутку
            id="channels-box"
            className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
          >
            {channels.map((channel) => {
              const isActive = currentChannel === channel.id;
              const hasDropdown = !isProtectedChannel(channel);

              if (!hasDropdown) {
                return (
                  <li key={channel.id} className="nav-item w-100">
                    <button
                      type="button"
                      onClick={() => handleChannelChange(channel.id)}
                      className={`w-100 rounded-0 text-start btn ${isActive ? 'btn-secondary' : ''}`}
                    >
                      <span className="me-1">#</span>
                      {channel.name}
                    </button>
                  </li>
                );
              }

              return (
                <li key={channel.id} className="nav-item w-100">
                  <Dropdown as="div" className={`btn-group w-100 custom-dropdown ${isActive ? 'active' : ''}`}>
                    <button
                      type="button"
                      className={`w-100 rounded-0 text-start text-truncate ${isActive ? 'btn btn-secondary' : 'btn'}`}
                      onClick={() => handleChannelChange(channel.id)}
                    >
                      <span className="me-1">#</span>
                      {channel.name}
                    </button>
                    <Dropdown.Toggle
                      split
                      variant={isActive ? 'secondary' : 'light'}
                      id={`dropdown-split-${channel.id}`}
                    >
                      <span className="visually-hidden">Управление каналом</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => {
                        setModalType('rename');
                        setSelectedChannel(channel);
                      }}
                      >
                        {t('chat.renameChannel')}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => {
                        setModalType('delete');
                        setSelectedChannel(channel);
                      }}
                      >
                        {t('chat.delete')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Правая панель - Сообщения и ввод */}
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>
                  #
                  {' '}
                  {channels.find((ch) => ch.id === currentChannel)?.name}
                </b>
              </p>
              <span className="text-muted">{`${messages.filter((msg) => msg.channelId === currentChannel).length} ${t('chat.messages')}`}</span>
            </div>
            <div
              id="messages-box"
              ref={messagesBoxRef} // Реф для сообщений
              onScroll={handleScrollMessages} // Слушаем прокрутку
              className="chat-messages overflow-auto px-5"
            >
              {messages.filter((msg) => msg.channelId === currentChannel).map((message) => (
                <div key={message.id} className="text-break mb-2">
                  <strong>
                    {message.username}
                    :
                  </strong>
                  {` ${message.body}`}
                </div>
              ))}
            </div>
            <Formik
              initialValues={{ messageBody: '' }}
              onSubmit={(values, { resetForm }) => {
                handleSendMessage(values.messageBody);
                resetForm();
              }}
            >
              {({ handleSubmit, values }) => (
                <Form
                  className="py-1 border rounded-2"
                  onSubmit={handleSubmit}
                >
                  <div className="input-group has-validation">
                    <Field
                      name="messageBody"
                      aria-label="Новое сообщение"
                      placeholder={t('chat.newMessage')}
                      className="border-0 p-0 ps-2 form-control"
                    />
                    <button
                      type="submit"
                      disabled={!values.messageBody.trim()}
                      className="btn btn-group-vertical"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width="20"
                        height="20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                        />
                      </svg>
                      <span className="visually-hidden">{t('chat.send')}</span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Modals for Add, Delete, and Rename Channels */}
      <Modal show={modalType === 'add'} onHide={() => setModalType(null)}>
        <Formik initialValues={{ name: '' }} validationSchema={validationSchema} onSubmit={handleAddChannel}>
          {({ errors, touched }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>{t('chat.addChannel')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label htmlFor="name" className="visually-hidden">
                  Имя канала
                </label>
                <Field
                  name="name"
                  id="name"
                  className={classNames('form-control', {
                    'is-invalid': touched.name && errors.name,
                    'is-valid': touched.name && !errors.name,
                  })}
                />
                {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalType(null)}>{t('chat.cancel')}</Button>
                <Button type="submit" variant="primary">{t('chat.send')}</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Modal for Deleting Channel */}
      <Modal show={modalType === 'delete'} onHide={() => setModalType(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('chat.deleteChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('chat.confirmDelete')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalType(null)}>{t('chat.cancel')}</Button>
          <Button variant="danger" onClick={handleRemoveChannel}>{t('chat.delete')}</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Renaming Channel */}
      <Modal show={modalType === 'rename'} onHide={() => setModalType(null)}>
        <Formik initialValues={{ name: selectedChannel?.name || '' }} validationSchema={validationSchema} onSubmit={({ name }) => handleRenameChannel(name)}>
          {({ errors, touched }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>{t('chat.renameChannel')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  name="name"
                  id="name"
                  className={classNames('form-control', {
                    'is-invalid': touched.name && errors.name,
                    'is-valid': touched.name && !errors.name,
                  })}
                />
                <label htmlFor="name" className="visually-hidden">
                  Имя канала
                </label>
                {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalType(null)}>{t('chat.cancel')}</Button>
                <Button type="submit" variant="primary">{t('chat.renameChannel')}</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default ChatPage;
