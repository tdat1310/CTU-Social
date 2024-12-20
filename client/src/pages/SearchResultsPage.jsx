import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const ModalExample = () => {
  const [isParentOpen, setIsParentOpen] = useState(false); // Modal cha ban đầu đóng
  const [isChildOpen, setIsChildOpen] = useState(false);

  const [post, setPost] = useState({
    id: 1,
    title: "Bài viết mẫu",
    content: "Đây là nội dung mẫu cho bài viết. Bạn có thể sửa nội dung này.",
    image: "https://via.placeholder.com/600x300",
  });

  const [comments, setComments] = useState([
    { id: 1, user: "Nguyễn Văn A", text: "Bài viết rất hay!" },
    { id: 2, user: "Trần Thị B", text: "Mình rất thích nội dung này." },
    { id: 3, user: "Lê Văn C", text: "Cảm ơn bạn đã chia sẻ!" },
  ]);

  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const openParentModal = () => setIsParentOpen(true);
  const closeParentModal = () => setIsParentOpen(false);
  const openChildModal = () => setIsChildOpen(true);
  const closeChildModal = () => setIsChildOpen(false);

  const savePostChanges = () => {
    setPost((prev) => ({
      ...prev,
      title: editedTitle,
      content: editedContent,
    }));
    closeChildModal();
  };

  return (
    <>
      {/* Nút mở modal cha */}
      <Button colorScheme="blue" onClick={openParentModal}>
        Mở Modal Cha
      </Button>

      {/* Modal Cha */}
      {isParentOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
          onClick={closeParentModal} // Đóng modal khi click ngoài
        >
          <div
            style={{
              width: "80%",
              height: "80%",
              background: "#ffffff",
              borderRadius: "12px",
              display: "flex",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()} // Ngăn click ngoài đóng modal
          >
            {/* Dấu X để đóng */}
            <IconButton
              aria-label="Đóng modal"
              icon={<CloseIcon />}
              size="sm"
              onClick={closeParentModal}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            />

            {/* Bên trái - Nội dung bài viết */}
            <div
              style={{
                flex: 2,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid #e2e8f0",
                overflowY: "auto",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <img
                  src={post.image}
                  alt="Post Content"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {post.title}
                </h2>
                <p style={{ lineHeight: "1.6", textAlign: "justify" }}>
                  {post.content}
                </p>
              </div>
              <Button colorScheme="teal" onClick={openChildModal}>
                Sửa bài viết
              </Button>
            </div>

            {/* Bên phải - Danh sách bình luận */}
            <div
              style={{
                flex: 1,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                Bình luận
              </h3>
              <div style={{ flex: 1 }}>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: "8px 12px",
                      borderBottom: "1px solid #e2e8f0",
                      marginBottom: "8px",
                    }}
                  >
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {comment.user}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        marginTop: "4px",
                      }}
                    >
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Con */}
      <Modal isOpen={isChildOpen} onClose={closeChildModal} size="lg" motionPreset="slideInBottom">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(2px)" />
        <ModalContent borderRadius="12px" padding="16px">
          <ModalHeader fontSize="20px" fontWeight="bold">
            Sửa Bài Viết
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="title" mb={4}>
              <FormLabel>Tiêu đề</FormLabel>
              <Input
                placeholder="Nhập tiêu đề mới"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </FormControl>
            <FormControl id="content" mb={4}>
              <FormLabel>Nội dung</FormLabel>
              <Textarea
                placeholder="Nhập nội dung bài viết"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={savePostChanges}>
              Lưu thay đổi
            </Button>
            <Button variant="ghost" onClick={closeChildModal}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalExample;
