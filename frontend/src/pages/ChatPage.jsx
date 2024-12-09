import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  fetchChatData,
  sendMessage,
  addChannel,
  removeChannel,
  renameChannel
} from '../store/chatSlice';
import { Modal, Button, Dropdown } from 'react-bootstrap';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { channels, messages, status, error } = useSelector((state) => state.chat);

  const [currentChannel, setCurrentChannel] = useState(channels[0]?.id || '');
  const [modalType, setModalType] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const defaultChannelId = channels[0]?.id || '';

  useEffect(() => {
    dispatch(fetchChatData());
  }, [dispatch]);

  const handleChannelChange = (channelId) => {
    setCurrentChannel(channelId);
  };

  const handleSendMessage = (messageBody) => {
    if (currentChannel) {
      dispatch(sendMessage({ channelId: currentChannel, body: messageBody }));
    }
  };

  const handleAddChannel = async (values, { resetForm }) => {
    try {
      await dispatch(addChannel(values.name)).unwrap();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveChannel = async () => {
    try {
      if (selectedChannel && selectedChannel.id !== defaultChannelId) {
        await dispatch(removeChannel(selectedChannel.id)).unwrap();
        setCurrentChannel(defaultChannelId);
        setModalType(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameChannel = async (newName) => {
    try {
      if (selectedChannel) {
        await dispatch(renameChannel({ id: selectedChannel.id, name: newName })).unwrap();
        setModalType(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Имя должно содержать минимум 3 символа')
      .max(20, 'Имя должно содержать максимум 20 символов')
      .required('Обязательно для заполнения')
      .test('unique', 'Имя уже существует', (value) =>
        !channels.some((channel) => channel.name === value)
      ),
  });

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-4 border-end">
          <h4>Channels</h4>

          {status === 'loading' && <p>Loading channels...</p>}
          {status === 'failed' && <p className="text-danger">{error}</p>}

          <ul className="list-group">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  currentChannel === channel.id ? 'active text-white' : ''
                }`}
              >
                <span onClick={() => handleChannelChange(channel.id)} style={{ cursor: 'pointer' }}>
                  #{channel.name}
                </span>
                <Dropdown>
                  <Dropdown.Toggle size="sm" variant="secondary">
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        setSelectedChannel(channel);
                        setModalType('rename');
                      }}
                    >
                      Rename
                    </Dropdown.Item>
                    {channel.id !== defaultChannelId && (
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedChannel(channel);
                          setModalType('delete');
                        }}
                      >
                        Delete
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
            Chat in {currentChannel ? `#${channels.find((ch) => ch.id === currentChannel)?.name}` : ''}
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
                  placeholder="Type a message..."
                  className="form-control"
                />
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </Form>
            )}
          </Formik>

          <Formik
            initialValues={{ name: '' }}
            validationSchema={validationSchema}
            onSubmit={handleAddChannel}
            validateOnBlur={false} // Отключаем автоматическую валидацию при потере фокуса
          >
            {({ errors, touched, handleBlur, handleChange, setFieldTouched, values }) => (
              <Form className="mt-3">
                <div className="input-group">
                  <Field
                    name="name"
                    placeholder="New Channel Name"
                    value={values.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(e);

                      // Если поле очищено, сбрасываем его состояние в "не тронутое"
                      if (value.trim() === '') {
                        setFieldTouched('name', false, false); // Сбрасываем touched и ошибки
                      }
                    }}
                    onBlur={(e) => {
                      // Если поле пустое, не запускаем валидацию
                      if (values.name.trim() === '') {
                        setFieldTouched('name', false, false);
                        return;
                      }
                      handleBlur(e); // В остальных случаях выполняем стандартную валидацию
                    }}
                    className={`form-control ${
                      touched.name
                        ? errors.name
                          ? 'is-invalid'
                          : 'is-valid'
                        : ''
                    }`}
                  />
                  <button type="submit" className="btn btn-success">
                    Add Channel
                  </button>
                  {touched.name && errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                  {touched.name && !errors.name && (
                    <div className="valid-feedback">Looks good!</div>
                  )}
                </div>
              </Form>
            )}
          </Formik>

        </div>
      </div>

      <Modal show={modalType === 'delete'} onHide={() => setModalType(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this channel?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalType(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRemoveChannel}>
            Delete
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
                <Modal.Title>Rename Channel</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  name="name"
                  placeholder="New Channel Name"
                  className={`form-control ${touched.name && errors.name ? 'is-invalid' : touched.name ? 'is-valid' : ''}`}
                />
                {touched.name && errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalType(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Rename
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
