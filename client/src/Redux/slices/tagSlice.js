import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BlogApi from "../../apis/blogApi";
import DataFormat from "../../utils/dataFormat";

const initialState = {
  loading: false,
  postByTag: [],
  totalPosts: "",
  tenTag: "",
  error: "",
};

// Async thunk to fetch global data (posts, users, tags, groups)
export const getAllPostByTagId = createAsyncThunk(
  "PostByTag/fetch",
  async (url) => {
    try {
      const response = await BlogApi.getAllPostByTagId(url);
      console.log(response)
      const format = response.posts.map((blog) => DataFormat(blog));
      return { format, totalPosts: response.totalPosts, tenTag:  response.tenTag};
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);


const tagSlice = createSlice({
  name: "tag",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllPostByTagId.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllPostByTagId.fulfilled, (state, action) => {
      state.loading = false;
      state.postByTag = action.payload.format || [];
      state.totalPosts = action.payload.totalPosts;
      state.tenTag =  action.payload.tenTag
    });
    builder.addCase(getAllPostByTagId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default tagSlice.reducer;
