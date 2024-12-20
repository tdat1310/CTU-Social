import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import TagInput from "./input/tagInput";
import UploadInput from "./input/uploadInput";
import FileUpload from "./input/fileUpload";
import TextEditor from "./textEditor/textEditor";
import BlogApi from "../../apis/blogApi";
import { useDispatch, useSelector } from "react-redux";
import { reloadData } from "../../Redux/slices/authSlice";
import { useParams } from "react-router-dom";
import { loadAllBlog, reloadDetailBlog } from "../../Redux/slices/blogSlice";
import { SocketContext } from "../../provider/socketContext";
import { fetchGlobalData } from "../../Redux/slices/globalSlice";
import { getAllPostByTagId } from "../../Redux/slices/tagSlice";
import {
  fetchAllPosttTypeGroup,
  fetchGroupDetails,
} from "../../Redux/slices/groupSlice";

const ModalCustom = memo(
  ({
    isModalOpen,
    onClose,
    editMode,
    blogData,
    detail,
    setReload,
    feed,
    tag,
    tagPost,
    group,
    groupAll,
  }) => {
    // console.log(blogData)
    const { post_id, tag_id, group_id } = useParams();
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const [data, setData] = useState({
      title: "",
      tags: [],
      images: [],
      files: [],
      content: "",
    });

    useEffect(() => {
      if (editMode) {
        setData({
          title: blogData.title,
          tags: blogData.Tags.map((item) => item.TenTag),
          images: blogData.imageList.map((item) => item.url_display),
          images_update: [],
          files: blogData.fileList,
          files_update: [],
          content: blogData.content,
        });
      }
    }, [blogData, editMode]);

    const [createLoading, setCreateLoading] = useState(false);
    const userDetail = useSelector((state) => state.auth.userDetail);
    const toast = useToast();
    const handleSubmit = async () => {
      if (
        data.title === "" ||
        data.content === "" ||
        data.content === '<p style="line-height: 1.5rem"></p>'
      ) {
        toast({
          title: "Có lỗi xảy ra",
          status: "error",
          description: "Tiêu đề và nội dung không được bỏ trống",
          isClosable: true,
        });
      } else {
        // console.log(data);
        setCreateLoading(true);
        const toastId = toast({
          title: `Đang ${editMode ? "cập nhật" : "tạo"} bài viết`,
          description: "Vui lòng đợi..",
          status: "loading",
          duration: null,
          isClosable: false,
        });
        try {
          const response = !editMode
            ? await BlogApi.createBlog(
                `posts/${userDetail._id}`,
                {
                  TieuDe: data.title,
                  NoiDung: data.content,
                  TaiKhoan_id: userDetail._id,
                  ...(group ? { Group_id: group_id, Group: true } : {}),
                },
                data.images,
                data.files,
                data.tags
              )
            : await BlogApi.updateBlog(
                `posts/${blogData.post_id}`,
                createUpdatedBlogData(blogData, data)
              );

          if (response) {
            //console.log(response)
            toast.update(toastId, {
              title: `${editMode ? "Cập nhật" : "Đăng bài"} thành công!`,
              description: `Bài viết đã được ${
                editMode ? "cập nhật" : "đăng tải"
              } `,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            dispatch(reloadData(`accounts/reload/${userDetail._id}`));
            dispatch(loadAllBlog(`accounts/${userDetail._id}?post=${tagPost}`));

            if (feed) {
              dispatch(fetchGlobalData(`infos/globalData?post=${tagPost}`));
            }
            if (tag) {
              dispatch(
                getAllPostByTagId(`posts/postByTag/${tag_id}?post=${tagPost}`)
              );
            }
            if (group) {
              dispatch(
                fetchGroupDetails(`groups/get/group/detail/${group_id}`)
              );
            }
            if (groupAll)
              dispatch(
                fetchAllPosttTypeGroup(
                  `groups/get/postTypeGroup/${userDetail._id}?post=${tagPost}`
                )
              );
            if (detail) dispatch(reloadDetailBlog(`posts/reload/${post_id}`));
            if (!editMode && !detail)
              socket.emit("newBlog", {
                owner: userDetail._id,
                postId: response._id,
              });
            setCreateLoading(false);
            onCloseHandle();
          }
        } catch (error) {
          toast.update(toastId, {
            title: `${editMode ? "Cập nhật" : "Đăng bài"} thất bại!`,
            description: "Có lỗi xảy ra",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          console.log(error);
          setCreateLoading(false);
        }
      }
    };

    const onCloseHandle = () => {
      editMode
        ? setData({
            title: blogData.title,
            tags: blogData.Tags.map((item) => item.TenTag),
            tags_update: [],
            images: blogData.imageList.map((item) => item.url_display),
            images_update: [],
            files: blogData.fileList,
            files_update: [],
            content: blogData.content,
          })
        : setData({
            title: "",
            tags: [],
            images: [],
            files: [],
            content: "",
          });
      onClose();
    };
    const createUpdatedBlogData = (transformedBlog, updatedBlogData) => {
      const originalTags = transformedBlog.Tags.map((tag) => tag.TenTag);
      const newTags = updatedBlogData.tags;

      const originalImages = transformedBlog.imageList;
      const newImages = updatedBlogData.images;

      const originalFiles = transformedBlog.fileList;
      const newFiles = updatedBlogData.files;

      // Get removed images with drive_id and _id
      const removedImages = originalImages
        .filter((image) => !newImages.includes(image.url_display))
        .map((image) => ({
          _id: image._id,
          drive_id: image.drive_id,
        }));

      // Get removed files with drive_id and _id
      const removedFiles = originalFiles
        .filter(
          (file) => !newFiles.map((newFile) => newFile.name).includes(file.name)
        )
        .map((file) => ({
          _id: file._id,
          drive_id: file.drive_id,
        }));

      return {
        post_id: transformedBlog.post_id,
        title: updatedBlogData.title,
        tags: {
          new: newTags.filter((tag) => !originalTags.includes(tag)),
          removed: originalTags.filter((tag) => !newTags.includes(tag)),
        },
        images: {
          new: [...updatedBlogData.images_update],
          removed: removedImages,
        },
        files: {
          new: [...updatedBlogData.files_update],
          removed: removedFiles,
        },
        content: updatedBlogData.content,
      };
    };

    return (
      <Modal isOpen={isModalOpen} onClose={onCloseHandle} size={"5xl"}>
        <ModalOverlay />
        <ModalContent maxH="80vh">
          <ModalHeader
            position="sticky"
            top={0}
            borderBottom="1px solid #E2E8F0"
          >
            {editMode ? "Sửa bài viết" : "Tạo bài viết"}
          </ModalHeader>
          <ModalCloseButton fontSize={"16px"} mt={"5px"} />
          <ModalBody overflowY="auto">
            <VStack spacing={"10px"}>
              <FormControl id="title">
                <FormLabel>Tiêu đề</FormLabel>
                <Input
                  type="text"
                  placeholder="Nhập tiêu đề"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                />
              </FormControl>
              <TagInput setData={setData} EditTagList={data.tags} />
              <UploadInput
                setData={setData}
                editImageList={data.images}
                editMode={editMode}
              />
              <FileUpload
                setData={setData}
                editFileList={data.files}
                editMode={editMode}
              />
              <TextEditor setData={setData} editContent={data.content} />
            </VStack>
          </ModalBody>
          <Flex
            position="sticky"
            bottom={-2}
            paddingBlock={"10px"}
            paddingInline={"50px"}
            justifyContent={"right"}
            w={"100%"}
            borderTop="1px solid #E2E8F0"
          >
            <Button onClick={handleSubmit} isLoading={createLoading}>
              {editMode ? "Cập nhật" : "Đăng bài"}
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    );
  }
);
ModalCustom.displayName = "ModalCustom";
export default ModalCustom;
