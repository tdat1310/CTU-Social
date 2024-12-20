import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserApi } from '../../apis/userApi';

export const loginUserAndSave = createAsyncThunk('user/login', async ({url, data}) => {
    try {
    //  console.log(data)
        const dataLogin = await UserApi.loginUser(url, data);
        return dataLogin;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error so it can be caught by the rejected case
    }
});
export const reloadData = createAsyncThunk('user/blog/reload', async (url) => {
    try {
        const dataUser = await UserApi.reloadUser(url);
        // console.log(dataUser)
        return dataUser;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error so it can be caught by the rejected case
    }
});

const initialState = {
    userDetail: null,
    loading: false,
    totalPost:'',
    error: ''
};

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.userDetail = null;
            state.loading = false;
            state.error = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUserAndSave.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loginUserAndSave.fulfilled, (state, action) => {
            state.loading = false;
            state.userDetail = action.payload;
        });
        builder.addCase(loginUserAndSave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        builder.addCase(reloadData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(reloadData.fulfilled, (state, action) => {
            state.loading = false;
            state.userDetail = action.payload;
        });
        builder.addCase(reloadData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
