import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

const socket = io('http://localhost:5002', {
  auth: {
    token,
  },
});

const initializeSocket = (store) => {
  // Подписка на события
  socket.on('newMessage', (payload) => {
    console.log('Новое сообщение:', payload);
    store.dispatch({ type: 'chat/socket/newMessage', payload });
  });

  socket.on('newChannel', (payload) => {
    console.log('Новый канал:', payload);
    store.dispatch({ type: 'chat/socket/newChannel', payload });
  });

  socket.on('removeChannel', (payload) => {
    console.log('Удален канал:', payload);
    store.dispatch({ type: 'chat/socket/removeChannel', payload });
  });

  socket.on('renameChannel', (payload) => {
    console.log('Переименован канал:', payload);
    store.dispatch({ type: 'chat/socket/renameChannel', payload });
  });
};

export { socket, initializeSocket };
