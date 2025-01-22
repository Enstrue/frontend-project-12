import { io } from 'socket.io-client';

const socket = io();

const initializeSocket = ({ dispatch }) => {
  // Подписка на события
  socket.on('newMessage', (payload) => {
    console.log('Новое сообщение:', payload);
    dispatch({ type: 'chat/socket/newMessage', payload });
  });

  socket.on('newChannel', (payload) => {
    console.log('Новый канал:', payload);
    dispatch({ type: 'chat/socket/newChannel', payload });
  });

  socket.on('removeChannel', (payload) => {
    console.log('Удален канал:', payload);
    dispatch({ type: 'chat/socket/removeChannel', payload });
  });

  socket.on('renameChannel', (payload) => {
    console.log('Переименован канал:', payload);
    dispatch({ type: 'chat/socket/renameChannel', payload });
  });
};

export { socket, initializeSocket };
