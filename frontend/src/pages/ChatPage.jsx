import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const [currentChannel, setCurrentChannel] = useState(channels[0]?.id || '');
  const [modalType, setModalType] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const defaultChannelId = channels[0]?.id || '';

  const isInitialRender = useRef(true);

  useEffect(() => {
    dispatch(fetchChatData())
      .then(() => {
        if (channels.length > 0) {
          if (isInitialRender.current) {
            setCurrentChannel(channels.find(channel => channel.name === 'general')?.id || '');
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
      dispatch(sendMessage({ channelId: currentChannel, body: messageBody }))
        .catch(() => {
          toast.error(t('chat.notifications.networkError'));
        });
    }
  };

  const handleAddChannel = async (values, { resetForm }) => {
    try {
      await dispatch(addChannel(values.name)).unwrap();
      toast.success(t('chat.notifications.channelCreated'));
      resetForm();
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
        await dispatch(renameChannel({ id: selectedChannel.id, name: newName })).unwrap();
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
      .required(t('validation.required'))
      .test('unique', t('validation.unique'), (value) =>
        !channels.some((channel) => channel.name === value)
      ),
  });

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row">
        {/* Секция каналов */}
        <div className="col-md-4 border-end">
          <h4>{t('chat.channels')}</h4>

          {status === 'failed' && <p className="text-danger">{t('error')}: {error}</p>}

          <ul className="list-group">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${currentChannel === channel.id ? 'active text-white' : ''}`}
              >
                <span onClick={() => handleChannelChange(channel.id)} style={{ cursor: 'pointer' }}>
                  #{channel.name}
                </span>
                <Dropdown>
                  <Dropdown.Toggle size="sm" variant="secondary">
                    {t('chat.actions')}
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

        {/* Секция сообщений и отправки */}
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
                  placeholder={t('chat.newMessage')}
                  className="form-control"
                />
                <button type="submit" className="btn btn-primary">
                  {t('chat.send')}
                </button>
              </Form>
            )}
          </Formik>

          {/* Добавление нового канала */}
          <Formik
            initialValues={{ name: '' }}
            validationSchema={validationSchema}
            onSubmit={handleAddChannel}
            validateOnBlur={false}
          >
            {({ errors, touched, handleBlur, handleChange, setFieldTouched, values }) => (
              <Form className="mt-3">
                <div className="input-group">
                  <Field
                    name="name"
                    placeholder={t('chat.addChannel')}
                    value={values.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(e);

                      if (value.trim() === '') {
                        setFieldTouched('name', false, false);
                      }
                    }}
                    onBlur={(e) => {
                      if (values.name.trim() === '') {
                        setFieldTouched('name', false, false);
                        return;
                      }
                      handleBlur(e);
                    }}
                    className={`form-control ${touched.name && errors.name ? 'is-invalid' : touched.name ? 'is-valid' : ''}`}
                  />
                  <button type="submit" className="btn btn-success">
                    {t('chat.addChannel')}
                  </button>
                  {touched.name && errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                  {touched.name && !errors.name && (
                    <div className="valid-feedback"></div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Модальные окна для удаления и переименования каналов */}
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
