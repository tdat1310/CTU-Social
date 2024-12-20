import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GroupApi } from "../../apis/groupApi";

const initialState = {
  loading: false,
  groups: [],         // Tất cả group
  groupPosts: [],     // Tất cả bài viết thuộc loại group
  groupDetails: null, // Chi tiết 1 group
  groupPostTotal: '',
  totalPosts: '',
  error: '',
  allPostTypeGroup: [], // Tất cả bài viết thuộc loại group
  totalPostsTypeGroup: '',
  attachments: {},
  searchResult: [] // Kết quả tìm kiếm
};

// Async thunk để fetch tất cả group
export const fetchGroups = createAsyncThunk("group/fetchAll", async ({ url }) => {
  try {
    const response = await GroupApi.getAllGroup(url);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Async thunk để fetch tất cả bài viết thuộc loại group
export const fetchGroupPosts = createAsyncThunk("group/fetchPosts", async () => {
  try {
    const response = await GroupApi.getGroupPosts();
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Async thunk để fetch chi tiết 1 group
export const fetchGroupDetails = createAsyncThunk("group/fetchDetails", async (url) => {
  try {
    const response = await GroupApi.getGroupDetails(url);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Async thunk để fetch tất cả bài viết thuộc loại group
export const fetchAllPosttTypeGroup = createAsyncThunk("group/fetchAllPost", async (url) => {
  try {
    const response = await GroupApi.getAllPostsFromGroups(url);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Async thunk để tìm kiếm bài viết
export const searchPost = createAsyncThunk("group/searchPost", async (url) => {
  try {
    const response = await GroupApi.searchPost(url); // Giả sử bạn có một API để tìm kiếm bài viết
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    clearSearchPost: (state) => {
      state.searchResult = []; // Clear kết quả tìm kiếm
    },
  },
  extraReducers: (builder) => {
    // Fetch tất cả group
    builder.addCase(fetchGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.loading = false;
      state.groups = action.payload || [];
    });
    builder.addCase(fetchGroups.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Fetch tất cả bài viết thuộc loại group
    builder.addCase(fetchGroupPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGroupPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.groupPosts = action.payload.posts || [];
    });
    builder.addCase(fetchGroupPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Fetch chi tiết 1 group
    builder.addCase(fetchGroupDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGroupDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.groupDetails = action.payload.groupInfo || null;
      state.attachments = action.payload.attachments;
      state.groupPosts = action.payload.groupPost || [];
      state.totalPosts = action.payload.totalPosts.length || 0;
    });
    builder.addCase(fetchGroupDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Fetch tất cả bài viết thuộc loại group
    builder.addCase(fetchAllPosttTypeGroup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllPosttTypeGroup.fulfilled, (state, action) => {
      state.loading = false;
      state.allPostTypeGroup = action.payload.allPosts || [];
      state.totalPostsTypeGroup = action.payload.total.length;
    });
    builder.addCase(fetchAllPosttTypeGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Tìm kiếm bài viết
    builder.addCase(searchPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(searchPost.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResult = action.payload.posts || []; // Lưu kết quả tìm kiếm
    });
    builder.addCase(searchPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
export const { clearSearchPost } = groupSlice.actions;
export default groupSlice.reducer;