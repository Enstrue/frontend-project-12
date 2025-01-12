import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/client';

// Получение данных о каналах и сообщениях
export const fetchChatData = createAsyncThunk('chat/fetchData', async () => {
  const token = localStorage.getItem('token');

  try {
    const channelsResponse = await apiClient.get('/api/v1/channels', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const messagesResponse = await apiClient.get('/api/v1/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      channels: channelsResponse.data,
      messages: messagesResponse.data,
    };
  } catch (err) {
    throw new Error('Failed to fetch chat data:', err);
  }
});

// Отправка нового сообщения
export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ channelId, body, username }) => {
  const token = localStorage.getItem('token');
  const response = await apiClient.post(
    `/api/v1/messages`,
    { body, channelId, userName: username },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
});

// Добавление нового канала
export const addChannel = createAsyncThunk('chat/addChannel', async (name) => {
  const token = localStorage.getItem('token');
  const response = await apiClient.post(
    '/api/v1/channels',
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
});

// Удаление канала
export const removeChannel = createAsyncThunk('chat/removeChannel', async (channelId) => {
  const token = localStorage.getItem('token');
  const response = await apiClient.delete(`/api/v1/channels/${channelId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
});

// Переименование канала
export const renameChannel = createAsyncThunk('chat/renameChannel', async ({ id, name }) => {
  const token = localStorage.getItem('token');
  const response = await apiClient.patch(
    `/api/v1/channels/${id}`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    username: '',  // Добавляем поле для имени пользователя
    status: 'idle',
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels = action.payload.channels;
        state.messages = action.payload.messages;
        state.username = action.payload.username;  // Сохраняем имя пользователя
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);  // Добавление нового сообщения в state
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);  // Добавление нового канала в state
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter((channel) => channel.id !== action.payload.id);
        state.messages = state.messages.filter((msg) => msg.channelId !== action.payload.id);  // Удаляем сообщения канала
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex((channel) => channel.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = action.payload;  // Обновляем название канала
        }
      });
  }
});

export default chatSlice.reducer;
