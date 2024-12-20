import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  List,
  ListItem,
  Text,
  Box,
  Flex,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import NotifyApi from "../../apis/notifyApi";
import GroupApi from "../../apis/groupApi";
import { notifyReload } from "../../Redux/slices/notifySlice";
import { fetchGroupDetails } from "../../Redux/slices/groupSlice";

const RequestListModal = ({ isOpen, onClose, requestList, groupId }) => {
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.auth.userDetail);
  // Filter requests by groupId
  const filteredRequests = requestList.filter(
    (request) =>
      request.fromGroup === groupId && request.NoiDung.type === "request"
  );

  const handleAcceptRequest = async (notify) => {
    // console.log(notify)
    await GroupApi.joinGroup(`groups/join/group`, {
      groupId: notify.fromGroup,
      userId: notify.fromUser,
    });
    await NotifyApi.clearAllNotify(`notify/clear/${notify._id}`);
    dispatch(notifyReload(`notify/${userDetail._id}`));
    dispatch(
      fetchGroupDetails(`groups/get/group/detail/${notify.fromGroup}?post=${3}`)
    );
  };
  const handleRejectRequest = async (notify) => {
    await NotifyApi.clearAllNotify(`notify/clear/${notify._id}`);
    dispatch(notifyReload(`notify/${userDetail._id}`));
    dispatch(
      fetchGroupDetails(`groups/get/group/detail/${notify.fromGroup}?post=${3}`)
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="lg" fontWeight="bold">
          Yêu cầu tham gia nhóm
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <List spacing={4}>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <ListItem
                  key={request._id}
                  p={3}
                  bg={'#eaf1f9'}
                  borderWidth={1}
                  borderRadius="md"
                  boxShadow="md"
                  border="1px solid #DFE0DC"
                >
                  <Flex justifyContent="space-between" alignItems="center" gap={'10px'}>
                    <Box display={"inline"}>
                      <Text fontWeight="600" fontSize="md" display={"inline"}>
                        {request.NoiDung.userName}
                      </Text>
                      <Text display={"inline"} color="gray.600">{request.NoiDung.info}</Text>
                    </Box>
                    <Flex>
                      <Button
                        colorScheme="blue"
                        onClick={() => handleAcceptRequest(request)}
                        size="sm"
                        mr={2}
                      >
                        Chấp nhận
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() => handleRejectRequest(request)}
                        size="sm"
                      >
                        Từ chối
                      </Button>
                    </Flex>
                  </Flex>
                </ListItem>
              ))
            ) : (
              <ListItem textAlign="center" color="gray.500">
                Không có yêu cầu nào.
              </ListItem>
            )}
          </List>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="blue">
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RequestListModal;
