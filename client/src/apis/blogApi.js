import axios from "axios";
import AttachApi from "./attachApi";

const BlogApi = {
  baseUrl: "http://localhost:8080/api/",

  formatUrl: (url) => BlogApi.baseUrl + url,

  request: async (method, url, data = null) => {
    try {
     // console.log(BlogApi.formatUrl(url));
      const response = await axios({
        method,
        url: BlogApi.formatUrl(url),
        data,
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  method: {
    post: (url, data) => BlogApi.request("post", url, data),
    get: (url) => BlogApi.request("get", url),
    put: (url, data) => BlogApi.request("put", url, data),
    delete: (url, data) => BlogApi.request("delete", url, data),
  },

  createTitleAndContent: (url, data) => BlogApi.method.post(url, data),

  createTag: async (url, tagsArray) => {
    try {
      const newUrl = BlogApi.formatUrl(url);
      const promises = tagsArray.map((tag) =>
        axios.post(newUrl, { TenTag: tag })
      );
      const responses = await Promise.all(promises);
      return responses.map((response) => response.data.TenTag);
    } catch (error) {
      console.error(error);
    }
  },

  createBlog: async (url, Content_Title, imageList, fileList, tagList) => {
    try {
      const TitleAndContent = await BlogApi.createTitleAndContent(
        url,
        Content_Title
      );
      if (TitleAndContent) {
        const tags = await BlogApi.createTag(
          `posts/tags/${TitleAndContent._id}`,
          tagList
        );
        const images = await AttachApi.createAttach(
          `posts/attachs/${TitleAndContent._id}`,
          imageList,
          "post-pic",
          "theDat"
        );
        const files = await AttachApi.createAttach(
          `posts/attachs/${TitleAndContent._id}`,
          fileList,
          "post-file",
          "theDat"
        );
        if (tags && images && files) {
          return {
            _id: TitleAndContent._id,
            TitleAndContent,
            tags,
            images,
            files,
          };
        }
      }
    } catch (error) {
      console.error(error);
    }
  },

  loadDataBlog: (url) => BlogApi.method.get(url),
  deleteBlog: (url, data) => BlogApi.method.delete(url, data),
  updateBlog: async (url, data) => {
    try {
      const response = await BlogApi.method.put(url, {
        data: {
          TieuDe: data.title,
          NoiDung: data.content,
        },
        remove_tags: data.tags.removed,
        remove_images: data.images.removed,
        remove_files: data.files.removed,
      });
      if (data.tags.new.length) {
        await BlogApi.createTag(`posts/tags/${data.post_id}`, data.tags.new);
      }
      if (data.images.new.length) {
        await AttachApi.createAttach(
          `posts/attachs/${data.post_id}`,
          data.images.new,
          "post-pic",
          "theDat"
        );
      }
      if (data.files.new.length) {
        await AttachApi.createAttach(
          `posts/attachs/${data.post_id}`,
          data.files.new,
          "post-file",
          "theDat"
        );
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  getInfoBlog: (url) => BlogApi.method.get(url),
  removeUserInteract: (url) => BlogApi.method.put(url),
  deleteComment: (url) => BlogApi.method.delete(url),
  editComment: (url, data) => BlogApi.method.put(url, data),
  getTag: (url) => BlogApi.method.get(url),
  getAllPostByTagId: (url) => BlogApi.method.get(url),
  followTag: (url, data) => BlogApi.method.put(url, data),
  unFollowTag: (url, data) => BlogApi.method.put(url, data),
};

export default BlogApi;
