import { io } from 'socket.io-client';

const socket = io();

const initializeSocket = ({ dispatch }) => {
  // Подписка на события
  socket.on('newMessage', (payload) => {
    dispatch({ type: 'chat/socket/newMessage', payload });
  });

  socket.on('newChannel', (payload) => {
    dispatch({ type: 'chat/socket/newChannel', payload });
  });

  socket.on('removeChannel', (payload) => {
    dispatch({ type: 'chat/socket/removeChannel', payload });
  });

  socket.on('renameChannel', (payload) => {
    dispatch({ type: 'chat/socket/renameChannel', payload });
  });
};

export { socket, initializeSocket };
