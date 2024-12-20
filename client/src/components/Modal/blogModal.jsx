import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Card,
} from "@chakra-ui/react";
import HeaderRender from "../card/cardPostUser/render/headerRender";
import ContentRender from "../card/cardPostUser/render/contentRender";
import FooterRender from "../card/cardPostUser/render/footerRender";
const BlogModal = ({
  isModalOpen,
  onClose,
  post_id,
  blogData,
  userDetail,
  handleCreatePostClick,
}) => {
  return (
    <Modal isOpen={isModalOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay/>
      <ModalContent >
        <Card>
          <ModalCloseButton />
          <ModalBody>
            <HeaderRender
              userDetail={userDetail}
              post_id={post_id}
              blogData={blogData}
              handleCreatePostClick={handleCreatePostClick}
              onClose={onClose}
              viewPost={true}
            />
            <ContentRender blogData={blogData} />
            <FooterRender
              blogData={blogData}
              user_id={userDetail._id}
              justContent={{ state: true, open: false }}
            />
          </ModalBody>
        </Card>
      </ModalContent>
    </Modal>
  );
};

export default BlogModal;
