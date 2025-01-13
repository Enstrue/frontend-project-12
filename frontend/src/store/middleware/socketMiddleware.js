import socket from '../../api/socket';
import { addMessage, addChannel, removeChannel, renameChannel } from '../chatSlice';

const socketMiddleware = (storeAPI) => (next) => (action) => {
  if (socket.listeners('newMessage').length === 0) {
    socket.on('newMessage', (message) => {
      storeAPI.dispatch(addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      storeAPI.dispatch(addChannel(channel));
    });

    socket.on('channelRemoved', (channelId) => {
      storeAPI.dispatch(removeChannel({ id: channelId }));
    });

    socket.on('channelRenamed', (channel) => {
      storeAPI.dispatch(renameChannel(channel));
    });
  }

  return next(action);
};

export default socketMiddleware;
