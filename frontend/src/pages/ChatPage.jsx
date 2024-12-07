import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatData } from '../store/chatSlice';

const ChatPage = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.chat.channels);
  const messages = useSelector((state) => state.chat.messages);
  const status = useSelector((state) => state.chat.status);
  const error = useSelector((state) => state.chat.error);

  const [selectedChannel, setSelectedChannel] = useState(null);

  // Загрузка данных чатов при монтировании компонента
  useEffect(() => {
    dispatch(fetchChatData());
  }, [dispatch]);

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
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
                    <p>
                      <strong>{message.username}:</strong> {message.body}
                    </p>
                  </div>
                ))
              ) : selectedChannel ? (
                <p className="text-muted">No messages in this channel</p>
              ) : (
                <p className="text-muted">Please select a channel</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
