import { Button } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FiCheck } from "react-icons/fi"; // Thêm icon check cho nút đã theo dõi
import { SocketContext } from "../../provider/socketContext";
import { UserApi } from "../../apis/userApi";
import { useDispatch } from "react-redux";
import { reloadData } from "../../Redux/slices/authSlice";
const FollowButton = ({ owner, followBy, follow, setReload }) => {
  const [isFollow, setFollow] = useState(false);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  useEffect(() => {
    // console.log(follow)
    setFollow(follow);
  }, [follow]);
  const followHandle = async () => {
    if (follow == false) {
      socket.emit("followUser", {
        owner: owner,
        followBy: followBy,
        opt: 2,
      });

      setTimeout(() => {
        setReload((prev) => !prev);
        dispatch(reloadData(`accounts/reload/${followBy}`));
      }, 100);
      //dispatch(reloadData(`accounts/reload/${owner}`));
    }

    if (follow == true) {
      await UserApi.unfollowUser("accounts/unfollow", {
        followerId: followBy,
        followingId: owner,
      });
      dispatch(reloadData(`accounts/reload/${followBy}`));
      socket.emit("followUser", {
        owner: owner,
        followBy: followBy,
        opt: 1,
      });
      setReload((prev) => !prev);

      // dispatch(reloadData(`accounts/reload/${owner}`));
    }
    //  setFollow(!isFollow);
  };
  return (
    <>
      <Button
        mt={"5px"}
        bgColor={isFollow ? "#2f2f2f" : "#718097"}
        color={"white"}
        leftIcon={isFollow ? <FiCheck /> : <FiPlus />}
        _hover={{ bgColor: isFollow ? "gray.600" : "gray.700" }} // Màu khi hover
        onClick={followHandle} // Thay đổi trạng thái khi nhấn nút
      >
        {isFollow ? "Đã theo dõi" : "Theo dõi"}
      </Button>
    </>
  );
};

export default FollowButton;
