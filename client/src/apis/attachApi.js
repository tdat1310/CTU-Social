import axios from "axios";
const AttachApi = {
  formatUrl: (url) => {
    return "http://localhost:8080/api/" + url;
  },
  createAttach: async (url, data, type, userName, userId, groupType) => {
    const newUrl = AttachApi.formatUrl(url);
    const promises = data.map((file) => {
      const fileFormData = new FormData();
      fileFormData.append("userName", userName);
      fileFormData.append("groupType", groupType);
      fileFormData.append("NguoiGui_id", userId);
      fileFormData.append("type", type);
      fileFormData.append("file", file);

      return axios.post(newUrl, fileFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
    try {
      const respond = await Promise.all(promises);
      return respond.map((response) => response.data);
    } catch (error) {
      console.log(error);
    }
  }
};

export default AttachApi;
