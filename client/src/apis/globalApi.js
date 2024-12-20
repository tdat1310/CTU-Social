import axios from "axios";

export const GlobalApi = {
  baseUrl: "http://localhost:8080/api/",

  formatUrl: (url) => GlobalApi.baseUrl + url,

  request: async (method, url, data = null) => {
    try {
      const response = await axios({ method, url: GlobalApi.formatUrl(url), data });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; // Ném lỗi để có thể xử lý trong slice
    }
  },

  method: {
    post: (url, data) => GlobalApi.request("post", url, data),
    get: (url) => GlobalApi.request("get", url),
    put: (url) => GlobalApi.request("put", url),
    delete: (url) => GlobalApi.request("delete", url),
  },

  // Các phương thức để lấy dữ liệu toàn cầu
  getGlobalData: (url) => GlobalApi.method.get(url),
  searchAllData: (url) => GlobalApi.method.get(url),
  getSuggestions: (url) => GlobalApi.method.get(url),
  getUserRecommend:  (url) => GlobalApi.method.get(url)
  // Bạn có thể thêm các phương thức khác nếu cần
};

export default GlobalApi;
