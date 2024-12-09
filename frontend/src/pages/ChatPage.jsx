import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatData, sendMessage } from '../store/chatSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');  // Подключение к серверу Socket.IO

const ChatPage = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.chat.channels);
  const messages = useSelector((state) => state.chat.messages);
  const status = useSelector((state) => state.chat.status);
  const error = useSelector((state) => state.chat.error);

  const [selectedChannel, setSelectedChannel] = useState('1'); // По умолчанию канал General
  const [newMessage, setNewMessage] = useState('');

  // Загрузка данных чатов при монтировании компонента
  useEffect(() => {
    dispatch(fetchChatData());

    // Подключение к WebSocket для получения сообщений
    socket.on('newMessage', (message) => {
      dispatch(sendMessage({ channelId: message.channelId, body: message.body }));
    });

    return () => {
      socket.off('newMessage');
    };
  }, [dispatch]);

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim()) {
      await dispatch(sendMessage({
        channelId: selectedChannel,
        body: newMessage,
      }));

      setNewMessage('');
      socket.emit('sendMessage', {
        channelId: selectedChannel,
        body: newMessage
      });
    }
  };

  if (status === 'loading') return <p className="text-center mt-5">Loading...</p>;
  if (status === 'failed') return <p className="text-danger mt-5">Error: {error}</p>;

  const filteredMessages = selectedChannel
    ? messages.filter((msg) => msg.channelId === selectedChannel)
    : [];

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Channels */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5>Channels</h5>
            </div>
            <div className="card-body">
              {channels.length > 0 ? (
                channels.map((channel) => (
                  <div
                    key={channel.id}
                    className={`p-2 mb-2 rounded ${selectedChannel === channel.id ? 'bg-light' : 'bg-white'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleChannelClick(channel.id)}
                  >
                    {channel.name}
                  </div>
                ))
              ) : (
                <p className="text-muted">No channels available</p>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-secondary text-white">
              <h5>Messages</h5>
            </div>

            <div className="card-body overflow-auto" style={{ height: '400px' }}>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <div key={message.id} className="mb-2 p-2 bg-light rounded">
                    <p><strong>{message.username}:</strong> {message.body}</p>
                  </div>
                ))
              ) : selectedChannel ? (
                <p className="text-muted">No messages in this channel</p>
              ) : (
                <p className="text-muted">Please select a channel</p>
              )}
            </div>

            {/* Input для отправки сообщений */}
            <form onSubmit={handleSendMessage} className="p-2 bg-light">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="form-control"
              />
              <button type="submit" className="btn btn-primary mt-2 btn-block">Send</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
