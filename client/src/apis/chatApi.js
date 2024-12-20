import axios from "axios";

export const ChatApi = {
  baseUrl: "http://localhost:8080/api/",
  
  formatUrl: (url) => ChatApi.baseUrl + url,
  
  request: async (method, url, data = null) => {
    try {
      const response = await axios({ method, url: ChatApi.formatUrl(url), data });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  method: {
    post: (url, data) => ChatApi.request("post", url, data),
    get: (url) => ChatApi.request("get", url),
    put: (url, data) => ChatApi.request("put", url, data),
  },

  createRoomChat: (url, data) => ChatApi.method.post(url, data),
  getAllRoomChat: (url) => ChatApi.method.get(url),
  getAllMessage: (url) => ChatApi.method.get(url),
  handleBoxChat: (url, data) => ChatApi.method.put(url, data),
  createGroupChat: (url, data) => ChatApi.method.post(url, data),
  getUnseenMessageCount: (url) => ChatApi.method.get(url),
  markAllMessagesAsSeen: (url, data) => ChatApi.method.put(url, data),
  editGroupChatName: (url, data) => ChatApi.method.put(url, data),
  deleteBoxchat: (url, data) => ChatApi.method.put(url, data),
  deleteSingeMessage: (url, data) => ChatApi.method.put(url, data),
  addMemberToGroupChat: (url, data) => ChatApi.method.put(url, data),
};
