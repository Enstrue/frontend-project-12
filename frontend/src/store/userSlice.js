import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: null,  // Изначально имя пользователя неизвестно
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
    },
    clearUser: (state) => {
      state.username = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
