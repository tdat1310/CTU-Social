import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BlogApi from "../../apis/blogApi";
import DataFormat from "../../utils/dataFormat";

const initialState = {
  loading: false,
  error: "",
  postDetail: null,
  allPost: null,
  userDetail: null,
  owner: "",
  totalPost: ''
};
export const reloadDetailBlog = createAsyncThunk("blog/reload", async (url) => {
  try {
    const dataBlog = await BlogApi.getInfoBlog(url);
    // console.log(dataBlog)
    return DataFormat(dataBlog);
  } catch (error) {
    console.log(error);
    throw error;
  }
});
export const loadAllBlog = createAsyncThunk("blog/getAll", async (url) => {
  try {
    const dataBlogs = await BlogApi.loadDataBlog(url);
    // console.log(dataBlogs)
    return dataBlogs;
  } catch (error) {
    console.log(error);
    throw error;
  }
});
export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    blogDetailClear: (state) => {
      state.postDetail = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reloadDetailBlog.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(reloadDetailBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.postDetail = action.payload;
    });
    builder.addCase(reloadDetailBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(loadAllBlog.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.allPost = action.payload.user.BaiDang;
      state.userDetail = action.payload.user;
      state.totalPost = action.payload.postCount
    });
    builder.addCase(loadAllBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { blogDetailClear } = blogSlice.actions;
export default blogSlice.reducer;
