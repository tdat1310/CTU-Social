/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { reloadData } from '../Redux/slices/authSlice';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const userDetail = useSelector((state) => state.auth.userDetail)
  const dispatch = useDispatch()
  const newSocket = useCallback(() => {
    const socket = io('http://localhost:8080');
    socket.on('connect', () => {
      console.log('Socket connected');
      const additionalData = { userId: userDetail ? userDetail._id  : "Chưa đăng nhập"};
      socket.emit('sendAdditionalData', additionalData);
      userDetail && dispatch(reloadData(`accounts/reload/${userDetail?._id}`));
      // socket.emit('onlineUser', additionalData);
     // console.log('Đã gửi dữ liệu bổ sung:', additionalData);
    });
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return socket;
  }, []);

  useEffect(() => {
    const socketInstance = newSocket();
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [newSocket]);

  return (
    <>
    {socket && (
      <SocketContext.Provider value={ socket }>
        {children}
      </SocketContext.Provider>
    )}
    </>
  );
};