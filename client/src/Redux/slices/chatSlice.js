import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ChatApi } from "../../apis/chatApi";

const initialState = {
  loading: false,
  boxChat: [],
  message: [],
  refBoxChat: "",
  error: "",
  boxChatCount: [],
};

// Thunks
export const loadAllRoom = createAsyncThunk("chat/getRoom", async (url) => {
  try {
    const rooms = await ChatApi.getAllRoomChat(url);
    return rooms;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const loadAllMessage = createAsyncThunk(
  "chat/getMessage",
  async (url) => {
    try {
      const message = await ChatApi.getAllMessage(url);
      return message;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const setRefBoxChat = createAsyncThunk(
  "chat/setRef",
  async ({ url, data }) => {
    try {
      const message = await ChatApi.handleBoxChat(url, data);
      return message;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

// Thunk mới: Lấy số lượng tin nhắn chưa đọc
export const getUnseenMessageCount = createAsyncThunk(
  "chat/getUnseenMessageCount",
  async (url) => {
    try {
      const count = await ChatApi.getUnseenMessageCount(url);
      return count;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

// Thunk mới: Đánh dấu tất cả tin nhắn là đã xem
export const markAllMessagesAsSeen = createAsyncThunk(
  "chat/markAllMessagesAsSeen",
  async ({ url, data }) => {
    try {
      const result = await ChatApi.markAllMessagesAsSeen(url, data);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearRefBoxChat: (state) => {
      state.refBoxChat = "";
    },
    clearMessage: (state) => {
      state.message = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setRefBoxChat.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(setRefBoxChat.fulfilled, (state, action) => {
      state.loading = false;
      state.refBoxChat = action.payload;
    });
    builder.addCase(setRefBoxChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(loadAllRoom.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllRoom.fulfilled, (state, action) => {
      state.loading = false;
      state.boxChat = action.payload;
    });
    builder.addCase(loadAllRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(loadAllMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload;
    });
    builder.addCase(loadAllMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(getUnseenMessageCount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUnseenMessageCount.fulfilled, (state, action) => {
      state.loading = false;
      state.boxChatCount = action.payload;
    });
    builder.addCase(getUnseenMessageCount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Xử lý cho markAllMessagesAsSeen
    builder.addCase(markAllMessagesAsSeen.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(markAllMessagesAsSeen.fulfilled, (state, action) => {
      state.loading = false;
      // Xử lý cập nhật trạng thái hoặc thông báo nếu cần
    });
    builder.addCase(markAllMessagesAsSeen.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { clearRefBoxChat, clearMessage } = chatSlice.actions;

export default chatSlice.reducer;
