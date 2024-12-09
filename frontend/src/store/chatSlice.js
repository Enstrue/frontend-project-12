// chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/client';

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
      messages: messagesResponse.data
    };
  } catch (err) {
    throw new Error('Failed to fetch chat data', err);
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ channelId, body }) => {
  const token = localStorage.getItem('token');

  const response = await apiClient.post(
    `/api/v1/messages`,
    { body, channelId },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  return response.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
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
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  }
});

export default chatSlice.reducer;