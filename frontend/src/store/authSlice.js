import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  isAuthenticated: false,
  token: null, // Для хранения токена, если нужно
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.username = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
