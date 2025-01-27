import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import * as Yup from 'yup';
import {
  fetchChatData,
  sendMessage,
  addNewChannel,
  removeExistingChannel,
  renameExistingChannel,
} from '../store/chatSlice';

import ChannelList from './components/ChannelList';
import MessageList from './components/MessageList';
import MessageInputForm from './components/MessageInputForm';
import ChannelModal from './components/ChannelModal';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const username = useSelector((state) => state.user.username);
  const {
    channels,
    messages,
    status,
  } = useSelector((state) => state.chat);

  const [currentChannel, setCurrentChannel] = useState('');
  const [modalType, setModalType] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const defaultChannelId = channels[0]?.id || '';
  const messageEndRef = useRef(null);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('validation.username'))
      .max(20, t('validation.username'))
      .required(t('signup.validation.required'))
      .test('unique', t('validation.unique'), (value) => !channels.some((channel) => channel.name === value)),
  });

  const isProtectedChannel = (channel) => ['general', 'random'].includes(channel.name);

  const messageCount = messages.filter((msg) => msg.channelId === currentChannel).length;

  const handleSendMessage = (body) => {
    const cleanMessage = leoProfanity.clean(body);
    if (body !== cleanMessage) {
      toast.error(t('chat.error.profanity'));
    }
    dispatch(sendMessage({ body: cleanMessage, username, channelId: currentChannel }));
  };

  // Функция добавления канала
  const handleAddChannel = async (values, { resetForm }) => {
    try {
      const cleanedName = leoProfanity.clean(values.name);
      const newChannel = await dispatch(addNewChannel(cleanedName)).unwrap();
      if (username) {
        setCurrentChannel(newChannel.id);
      }
      toast.success(t('chat.notifications.channelCreated'));
      resetForm();
      setModalType(null);
    } catch {
      toast.error(t('chat.notifications.networkError'));
    }
  };

  // Функция удаления канала
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

  // Функция переименования канала
  const handleRenameChannel = async (newName) => {
    try {
      if (selectedChannel && !isProtectedChannel(selectedChannel)) {
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

  useEffect(() => {
    dispatch(fetchChatData());
    setCurrentChannel(defaultChannelId);
  }, [dispatch]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Если статус "loading", отображаем спиннер
  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="row h-100 bg-white flex-md-row">
      <ToastContainer position="top-right" autoClose={3000} />
      <ChannelList
        channels={channels}
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        setModalType={setModalType}
        setSelectedChannel={setSelectedChannel}
      />
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
            <span className="text-muted">{`${t('chat.messages', { count: messageCount })}`}</span>
          </div>
          <MessageList className="chat-messages overflow-auto px-5" messages={messages} currentChannel={currentChannel} />
          <MessageInputForm handleSendMessage={handleSendMessage} />
        </div>
      </div>
      <ChannelModal
        modalType={modalType}
        setModalType={setModalType}
        selectedChannel={selectedChannel}
        handleAddChannel={handleAddChannel}
        handleRenameChannel={handleRenameChannel}
        handleRemoveChannel={handleRemoveChannel}
        validationSchema={validationSchema}
      />
    </div>
  );
};

export default ChatPage;
