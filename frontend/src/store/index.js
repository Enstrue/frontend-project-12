import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import chatReducer from './chatSlice.js';
import { initializeSocket } from '../api/socket.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
});

// Инициализация сокета
initializeSocket(store);

export default store;
