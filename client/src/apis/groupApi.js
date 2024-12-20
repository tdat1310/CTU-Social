import axios from "axios";

export const GroupApi = {
  baseUrl: "http://localhost:8080/api/",

  formatUrl: (url) => GroupApi.baseUrl + url,

  request: async (method, url, data = null) => {
    try {
      const response = await axios({
        method,
        url: GroupApi.formatUrl(url),
        data,
      });
      // console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; // Ném lỗi để xử lý trong slice
    }
  },

  method: {
    post: (url, data) => GroupApi.request("post", url, data),
    get: (url) => GroupApi.request("get", url),
    put: (url, data) => GroupApi.request("put", url, data),
    delete: (url) => GroupApi.request("delete", url),
  },

  // Phương thức tạo nhóm
  createGroup: (url, data) => GroupApi.method.post(url, data),

  // Phương thức lấy tất cả group
  getAllGroups: (url) => GroupApi.method.get(url), // API GET tất cả các nhóm

  // Phương thức lấy tất cả bài viết thuộc loại group
  getGroupPosts: (url) => GroupApi.method.get(url), // API GET tất cả bài viết loại group

  // Phương thức lấy chi tiết 1 group theo ID
  getGroupDetails: (url) => GroupApi.method.get(url), // API GET chi tiết group

  // Phương thức tham gia nhóm
  joinGroup: (url, data) => GroupApi.method.put(url, data),

  // Phương thức lấy tất cả nhóm
  getAllGroup: (url) => GroupApi.method.get(url),

  // Phương thức sửa thông tin nhóm
  updateGroupInfo: (url, data) => GroupApi.method.put(url, data),

  // Phương thức lấy tất cả bài viết type group
  getAllPostsFromGroups: (url) => GroupApi.method.get(url),

  // Phương thức rời nhóm
  leaveGroup: (url, data) => GroupApi.method.put(url, data),

  deleteGroup: (url, data) => GroupApi.method.put(url, data),

  addAcceptRole: (url, data) => GroupApi.method.put(url, data),

  searchPost: (url) => GroupApi.method.get(url)

};

export default GroupApi;
