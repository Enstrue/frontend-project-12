import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import chatReducer from './chatSlice.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
});

export default store;