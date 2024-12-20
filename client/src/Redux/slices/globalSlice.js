import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GlobalApi } from "../../apis/globalApi";

const initialState = {
  loading: false,
  totalPost: '',
  posts: [],
  users: [],
  tags: [],
  groups: [],
  postChart: [],
  searchResult: {
    posts: [],
    users: [],
    tags: [],
    groups: [],
  },
  searchSuggest: [],
  userRecommend: [],
  error: ''
};

// Async thunk to fetch global data (posts, users, tags, groups)
export const fetchGlobalData = createAsyncThunk("global/fetch", async (url) => {
  try {
    const response = await GlobalApi.getGlobalData(url);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Async thunk to search all data
export const searchAllData = createAsyncThunk("global/search", async (url) => {
  try {
    const response = await GlobalApi.searchAllData(url);
    console.log(response)
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Async thunk to get suggestions for the search bar
export const getSuggestions = createAsyncThunk("global/getSuggestions", async (url) => {
  try {
    const response = await GlobalApi.getSuggestions(url);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const getUserRecommend = createAsyncThunk("global/getUserRecommend", async (url) => {
  try {
    const response = await GlobalApi.getUserRecommend(url);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

const globalSlice = createSlice({
  name: "global",
  initialState,
  extraReducers: (builder) => {
    // Handling fetchGlobalData cases
    builder
      .addCase(fetchGlobalData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGlobalData.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts || [];
        state.totalPost = action.payload.totalPost;
        state.postChart = action.payload.postChart || []
        state.users = action.payload.users || [];
        state.tags = action.payload.tags || [];
        state.groups = action.payload.groups || [];
      })
      .addCase(fetchGlobalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handling searchAllData cases
      .addCase(searchAllData.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = {
          posts: action.payload?.posts || [],
          users: action.payload?.users || [],
          tags: action.payload?.tags || [],
          groups: action.payload?.groups || [],
        };
      })
      .addCase(searchAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handling getSuggestions cases
      .addCase(getSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.searchSuggest = action.payload || '';
      })
      .addCase(getSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handling getSuggestions cases
      .addCase(getUserRecommend.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserRecommend.fulfilled, (state, action) => {
        state.loading = false;
        state.userRecommend = action.payload || [];
      })
      .addCase(getUserRecommend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default globalSlice.reducer;
