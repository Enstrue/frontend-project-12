import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import leoProfanity from 'leo-profanity';
import {
  fetchChatData,
  sendMessage,
  addChannel,
  removeChannel,
  renameChannel
} from '../store/chatSlice';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { channels, messages, status, error } = useSelector((state) => state.chat);

  const [currentChannel, setCurrentChannel] = useState('');
  const [modalType, setModalType] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const defaultChannelId = channels[0]?.id || '';

  const isInitialRender = useRef(true);

  useEffect(() => {
    leoProfanity.loadDictionary('ru');
    dispatch(fetchChatData())
      .then(() => {
        if (channels.length > 0) {
          if (isInitialRender.current) {
            setCurrentChannel(channels.find(channel => channel.name === 'general')?.id || channels[0]?.id || '');
            isInitialRender.current = false;
          }
        }
      })
      .catch(() => {
        toast.error(t('chat.notifications.fetchError'));
      });
  }, [dispatch, channels, t]);

  const handleChannelChange = (channelId) => {
    setCurrentChannel(channelId);
  };

  const handleSendMessage = (messageBody) => {
    if (currentChannel) {
      const cleanedMessage = leoProfanity.clean(messageBody);
      dispatch(sendMessage({ channelId: currentChannel, body: cleanedMessage }))
        .catch(() => {
          toast.error(t('chat.notifications.networkError'));
        });
    }
  };

  const handleAddChannel = async (values, { resetForm }) => {
    try {
      const cleanedName = leoProfanity.clean(values.name);
      await dispatch(addChannel(cleanedName)).unwrap();
      toast.success(t('chat.notifications.channelCreated'));
      resetForm();
      setModalType(null);
    } catch (err) {
      toast.error(t('chat.notifications.networkError'));
      console.error(err);
    }
  };

  const handleRemoveChannel = async () => {
    try {
      if (selectedChannel && selectedChannel.id !== defaultChannelId) {
        await dispatch(removeChannel(selectedChannel.id)).unwrap();
        toast.success(t('chat.notifications.channelDeleted'));
        setCurrentChannel(defaultChannelId);
        setModalType(null);
      }
    } catch (err) {
      toast.error(t('chat.notifications.networkError'));
      console.error(err);
    }
  };

  const handleRenameChannel = async (newName) => {
    try {
      if (selectedChannel) {
        const cleanedName = leoProfanity.clean(newName);
        await dispatch(renameChannel({ id: selectedChannel.id, name: cleanedName })).unwrap();
        toast.success(t('chat.notifications.channelRenamed'));
        setModalType(null);
      }
    } catch (err) {
      toast.error(t('chat.notifications.networkError'));
      console.error(err);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('validation.usernameMin'))
      .max(20, t('validation.usernameMax'))
      .required(t('signup.validation.required'))
      .test('unique', t('validation.unique'), (value) =>
        !channels.some((channel) => channel.name === value)
      ),
  });

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row">
        <div className="col-md-4 border-end">
          <h4 className="d-flex justify-content-between align-items-center">
            {t('chat.channels')}
            <Button variant="primary" onClick={() => setModalType('add')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" className="me-1">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              </svg>
              <span className="visually-hidden">+</span>
            </Button>
          </h4>

          {status === 'failed' && <p className="text-danger">{t('error')}: {error}</p>}

          <ul className="list-group">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${currentChannel === channel.id ? 'active text-white' : ''}`}
              >
                <button
                  onClick={() => handleChannelChange(channel.id)}
                  className={`w-100 rounded-0 text-start btn`}
                  style={{ cursor: 'pointer' }}
                >
                  #{channel.name}
                </button>
                <Dropdown>
                  <Dropdown.Toggle size="sm" variant="secondary">
                    <span className="visually-hidden">{'Управление каналом'}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        setSelectedChannel(channel);
                        setModalType('rename');
                      }}
                    >
                      {t('chat.renameChannel')}
                    </Dropdown.Item>
                    {channel.id !== defaultChannelId && (
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedChannel(channel);
                          setModalType('delete');
                        }}
                      >
                        {t('chat.delete')}
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-8">
          <h4>
            {t('chat.chatIn')} {currentChannel ? `#${channels.find((ch) => ch.id === currentChannel)?.name}` : ''}
          </h4>

          <div className="chat-box border rounded p-3 mb-3" style={{ height: '300px', overflowY: 'scroll' }}>
            {messages
              .filter((msg) => msg.channelId === currentChannel)
              .map((message) => (
                <div key={message.id} className="mb-2">
                  <strong>{message.username}:</strong> {message.body}
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
            {({ handleSubmit }) => (
              <Form className="input-group" onSubmit={handleSubmit}>
                <Field
                  name="messageBody"
                  aria-label="Новое сообщение"
                  placeholder={t('chat.newMessage')}
                  className="form-control"
                />
                <button type="submit" className="btn btn-primary">
                  {t('chat.send')}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <Modal show={modalType === 'add'} onHide={() => setModalType(null)}>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={handleAddChannel}
        >
          {({ errors, touched }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>{t('chat.addChannel')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  name="name"
                  id="name"
                  placeholder=""
                  className={`form-control ${touched.name && errors.name ? 'is-invalid' : touched.name ? 'is-valid' : ''}`}
                />
                <label htmlFor="name" className="visually-hidden">
                  Имя канала
                </label>
                {touched.name && errors.name && (
                  <div className="invalid-feedback">{t('signup.validation.username')}</div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalType(null)}>
                  {t('chat.cancel')}
                </Button>
                <Button type="submit" variant="primary">
                  {t('chat.send')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal show={modalType === 'delete'} onHide={() => setModalType(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('chat.deleteChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('chat.confirmDelete')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalType(null)}>
            {t('chat.cancel')}
          </Button>
          <Button variant="danger" onClick={handleRemoveChannel}>
            {t('chat.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalType === 'rename'} onHide={() => setModalType(null)}>
        <Formik
          initialValues={{ name: selectedChannel?.name || '' }}
          validationSchema={validationSchema}
          onSubmit={({ name }) => handleRenameChannel(name)}
        >
          {({ errors, touched }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>{t('chat.renameChannel')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  name="name"
                  placeholder={t('chat.newChannelPlaceholder')}
                  className={`form-control ${touched.name && errors.name ? 'is-invalid' : touched.name ? 'is-valid' : ''}`}
                />
                {touched.name && errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalType(null)}>
                  {t('chat.cancel')}
                </Button>
                <Button type="submit" variant="primary">
                  {t('chat.renameChannel')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default ChatPage;
