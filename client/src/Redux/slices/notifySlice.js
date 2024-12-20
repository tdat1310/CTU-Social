import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { NotifyApi } from "../../apis/notifyApi";

const initialState = {
  loading: false,
  notifyList: null,
  error: ''
};

export const notifyReload = createAsyncThunk("notify/load", async (url) => {
    try {
        const notifyList = NotifyApi.getNotifyOfUser(url)
        return notifyList
    } catch (error) {
        console.log(error);
    }
});
export const notifySetStatus = createAsyncThunk("notify/seen", async (url) => {
    try {
        const notifyList = NotifyApi.updateSeenStatus(url)
        return notifyList
    } catch (error) {
        console.log(error);
    }
});
export const notifyClear = createAsyncThunk("notify/clear", async (url) =>{
  try {
    console.log(url)
    return NotifyApi.clearAllNotify(url)
} catch (error) {
    console.log(error);
}
})
const notifySlice = createSlice({
  name: "notify",
  initialState,
  extraReducers: (builder) => {
      builder.addCase(notifyReload.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(notifyReload.fulfilled, (state, action) => {
        state.loading = false;
        state.notifyList = action.payload ? action.payload.reverse() : [];
      });
      builder.addCase(notifyReload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      builder.addCase(notifySetStatus.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(notifySetStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.notifyList = action.payload;
      });
      builder.addCase(notifySetStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      builder.addCase(notifyClear.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(notifyClear.fulfilled, (state) => {
        state.loading = false;
        state.notifyList = null;
      });
      builder.addCase(notifyClear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default notifySlice.reducer;