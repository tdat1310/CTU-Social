import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminApi } from '../../apis/adminApi';

// Thunk để lấy tất cả báo cáo
export const getAllReports = createAsyncThunk('admin/getAllReports', async (url) => {
    try {
        const reports = await AdminApi.getAllReports(url);
        return reports;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

// Thunk để lấy tất cả tài khoản
export const getAllAccounts = createAsyncThunk('admin/getAllAccounts', async (url) => {
    try {
        const accounts = await AdminApi.getAllAccounts(url);
        return accounts;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

const initialState = {
    reports: [], // Lưu trữ danh sách báo cáo
    accounts: [], // Lưu trữ danh sách tài khoản
    loading: false,
    error: '',
};

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        resetReports: (state) => {
            state.reports = []; // Đặt lại báo cáo
            state.loading = false; // Đặt lại trạng thái loading
            state.error = ''; // Đặt lại thông báo lỗi
        },
        clearAllData: (state) => {
            // Hàm để xóa hết dữ liệu
            state.reports = [];
            state.accounts = [];
            state.loading = false;
            state.error = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllReports.pending, (state) => {
                state.loading = true; // Bắt đầu tải dữ liệu báo cáo
            })
            .addCase(getAllReports.fulfilled, (state, action) => {
                state.loading = false; // Kết thúc tải dữ liệu báo cáo
                state.reports = action.payload; // Lưu trữ báo cáo
            })
            .addCase(getAllReports.rejected, (state, action) => {
                state.loading = false; // Kết thúc tải dữ liệu báo cáo
                state.error = action.error.message; // Lưu thông báo lỗi
            })
            .addCase(getAllAccounts.pending, (state) => {
                state.loading = true; // Bắt đầu tải dữ liệu tài khoản
            })
            .addCase(getAllAccounts.fulfilled, (state, action) => {
                state.loading = false; // Kết thúc tải dữ liệu tài khoản
                state.accounts = action.payload; // Lưu trữ tài khoản
            })
            .addCase(getAllAccounts.rejected, (state, action) => {
                state.loading = false; // Kết thúc tải dữ liệu tài khoản
                state.error = action.error.message; // Lưu thông báo lỗi
            });
    },
});

export const { resetReports, clearAllData } = adminSlice.actions;
export default adminSlice.reducer;
