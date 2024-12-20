import axios from "axios";

export const UserApi = {
  baseUrl: "http://localhost:8080/api/",

  formatUrl: (url) => UserApi.baseUrl + url,

  request: async (method, url, data = null) => {
    try {
      const response = await axios({ method, url: UserApi.formatUrl(url), data });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Server responded with a status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error in setting up request:', error.message);
      }
    }
  },

  method: {
    post: (url, data) => UserApi.request("post", url, data),
    get: (url) => UserApi.request("get", url),
    put: (url, data) => UserApi.request("put", url, data),
  },

  createNewUser: (url, data) => UserApi.method.post(url, data),
  loginUser: (url, data) => UserApi.method.post(url, data),
  reloadUser: (url) => UserApi.method.get(url),
  getUserName: (url) => UserApi.method.get(url),
  getUserInfo: (url) => UserApi.method.get(url),
  unfollowUser: (url, data) => UserApi.method.put(url, data),
  updateInfo: (url, data) => UserApi.method.put(url, data),
};
