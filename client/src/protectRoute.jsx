import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectRoute = ({ children }) => {
  const userDetail = useSelector(state => state.auth.userDetail);
  if (!userDetail) {
    // Nếu không có userDetail, chuyển hướng về trang chính
    return <Navigate to="/" />;
  }

  return children; // Nếu có userDetail, render children
};

export default ProtectRoute;