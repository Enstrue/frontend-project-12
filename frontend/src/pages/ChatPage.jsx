import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import leoProfanity from "leo-profanity";
import {
  fetchChatData,
  sendMessage,
  addNewChannel,
  removeExistingChannel,
  renameExistingChannel,
} from "../store/chatSlice";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username);

  const { channels, messages, status, error } = useSelector(
    (state) => state.chat
  );

  const [currentChannel, setCurrentChannel] = useState("");
  const [modalType, setModalType] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const defaultChannelId = channels[0]?.id || "";

  const isInitialRender = useRef(true);

  useEffect(() => {
    leoProfanity.loadDictionary("ru");
    leoProfanity.loadDictionary("en");
    dispatch(fetchChatData())
      .then(() => {
        if (channels.length > 0 && isInitialRender.current) {
          setCurrentChannel(
            channels.find((channel) => channel.name === "general")?.id ||
              defaultChannelId
          );
          isInitialRender.current = false;
        }
      })
      .catch(() => {
        toast.error(t("chat.notifications.fetchError"));
      });
  }, [dispatch, t, channels, defaultChannelId]);

  const handleChannelChange = (channelId) => {
    setCurrentChannel(channelId);
  };

  const handleSendMessage = (messageBody) => {
    if (currentChannel) {
      const cleanedMessage = leoProfanity.clean(messageBody);
      dispatch(
        sendMessage({
          channelId: currentChannel,
          body: cleanedMessage,
          username,
          timestamp: new Date().toISOString(),
        })
      ).catch(() => {
        toast.error(t("chat.notifications.networkError"));
      });
    }
  };

  const isProtectedChannel = (channel) =>
    ["general", "random"].includes(channel.name);

  const handleAddChannel = async (values, { resetForm }) => {
    try {
      const cleanedName = leoProfanity.clean(values.name);
      await dispatch(addNewChannel(cleanedName)).unwrap();
      toast.success(t("chat.notifications.channelCreated"));
      resetForm();
      setModalType(null);
    } catch {
      toast.error(t("chat.notifications.networkError"));
    }
  };

  const handleRemoveChannel = async () => {
    try {
      if (
        selectedChannel &&
        selectedChannel.id !== defaultChannelId &&
        !isProtectedChannel(selectedChannel)
      ) {
        await dispatch(removeExistingChannel(selectedChannel.id)).unwrap();
        toast.success(t("chat.notifications.channelDeleted"));
        setCurrentChannel(defaultChannelId);
        setModalType(null);
      } else {
        toast.error(t("chat.notifications.protectedChannelDeleteError"));
      }
    } catch {
      toast.error(t("chat.notifications.networkError"));
    }
  };

  const handleRenameChannel = async (newName) => {
    try {
      if (selectedChannel && !isProtectedChannel(selectedChannel)) {
        const cleanedName = leoProfanity.clean(newName);
        await dispatch(
          renameExistingChannel({ id: selectedChannel.id, name: cleanedName })
        ).unwrap();
        toast.success(t("chat.notifications.channelRenamed"));
        setModalType(null);
      } else {
        toast.error(t("chat.notifications.protectedChannelRenameError"));
      }
    } catch {
      toast.error(t("chat.notifications.networkError"));
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t("validation.usernameMin"))
      .max(20, t("validation.usernameMax"))
      .required(t("signup.validation.required"))
      .test(
        "unique",
        t("validation.unique"),
        (value) => !channels.some((channel) => channel.name === value)
      ),
  });

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row">
        <div className="col-md-4 border-end">
          <h4 className="d-flex justify-content-between align-items-center">
            {t("chat.channels")}
            <Button variant="primary" onClick={() => setModalType("add")}>
              +
            </Button>
          </h4>

          {status === "failed" && (
            <p className="text-danger">
              {t("error")}: {error}
            </p>
          )}

          <ul className="list-group">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  currentChannel === channel.id ? "active text-white" : ""
                }`}
              >
                <button
                  onClick={() => handleChannelChange(channel.id)}
                  className="w-100 rounded-0 text-start btn"
                  style={{ cursor: "pointer" }}
                >
                  #{channel.name}
                </button>
                {!isProtectedChannel(channel) && (
                  <Dropdown>
                    <Dropdown.Toggle size="sm" variant="secondary">
                      <span className="visually-hidden">
                        {"Управление каналом"}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedChannel(channel);
                          setModalType("rename");
                        }}
                      >
                        {t("chat.renameChannel")}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedChannel(channel);
                          setModalType("delete");
                        }}
                      >
                        {t("chat.delete")}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-8">
          <h4>
            {t("chat.chatIn")}{" "}
            {currentChannel
              ? `#${channels.find((ch) => ch.id === currentChannel)?.name}`
              : ""}
          </h4>

          <div
            className="chat-box border rounded p-3 mb-3"
            style={{ height: "300px", overflowY: "scroll" }}
          >
            {messages
              .filter((msg) => msg.channelId === currentChannel)
              .map((message) => (
                <div key={message.id} className="mb-2">
                  <strong>{message.username}:</strong> {message.body}
                </div>
              ))}
          </div>

          <Formik
            initialValues={{ messageBody: "" }}
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
                  placeholder={t("chat.newMessage")}
                  className="form-control"
                />
                <button type="submit" className="btn btn-primary">
                  {t("chat.send")}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <Modal show={modalType === "add"} onHide={() => setModalType(null)}>
        <Formik
          initialValues={{ name: "" }}
          validationSchema={validationSchema}
          onSubmit={handleAddChannel}
        >
          {({ errors, touched }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>{t("chat.addChannel")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  name="name"
                  id="name"
                  className={`form-control ${
                    touched.name && errors.name
                      ? "is-invalid"
                      : touched.name
                      ? "is-valid"
                      : ""
                  }`}
                />
              <span className="visually-hidden">
                {"Имя канала"}
              </span>
                {touched.name && errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalType(null)}>
                  {t("chat.cancel")}
                </Button>
                <Button type="submit" variant="primary">
                  {t("chat.send")}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal show={modalType === "delete"} onHide={() => setModalType(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("chat.deleteChannel")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("chat.confirmDelete")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalType(null)}>
            {t("chat.cancel")}
          </Button>
          <Button variant="danger" onClick={handleRemoveChannel}>
            {t("chat.delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalType === "rename"} onHide={() => setModalType(null)}>
        <Formik
          initialValues={{ name: selectedChannel?.name || "" }}
          validationSchema={validationSchema}
          onSubmit={({ name }) => handleRenameChannel(name)}
        >
          {({ errors, touched }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>{t("chat.renameChannel")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  name="name"
                  id="name"
                  className={`form-control ${
                    touched.name && errors.name
                      ? "is-invalid"
                      : touched.name
                      ? "is-valid"
                      : ""
                  }`}
                />
                {touched.name && errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalType(null)}>
                  {t("chat.cancel")}
                </Button>
                <Button type="submit" variant="primary">
                  {t("chat.renameChannel")}
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
