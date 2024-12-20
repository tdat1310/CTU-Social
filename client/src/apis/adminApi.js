import axios from "axios";
import { ChatApi } from "./chatApi";

export const AdminApi = {
  baseUrl: "http://localhost:8080/api/",

  formatUrl: (url) => AdminApi.baseUrl + url,

  request: async (method, url, data = null) => {
    try {
      const response = await axios({
        method,
        url: AdminApi.formatUrl(url),
        data,
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  method: {
    post: (url, data) => AdminApi.request("post", url, data),
    get: (url) => AdminApi.request("get", url),
    put: (url, data) => AdminApi.request("put", url, data),
    delete: (url, data) => AdminApi.request("delete", url, data),
  },

  getAllReports: (url) => AdminApi.method.get(url),
  lockAccount: (url, data) => AdminApi.method.put(url, data),
  statusReportConfirm: (url, data) => AdminApi.method.put(url, data),
  getAllAccounts: (url) => AdminApi.method.get(url),
  deleteReport: (url, data) => AdminApi.method.delete(url, data),
  createReport: (url, data) => AdminApi.method.post(url, data)
};
