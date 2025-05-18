'use client'

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, resetUser } from '@/redux/userStore';
import userService from '@/services/userService';

const UserInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const user = await userService.getUserInformation();
          dispatch(setUser(user));
        }
      } catch (error) {
        dispatch(resetUser());
        localStorage.removeItem('access_token');
      }
    };

    fetchData();
  }, [dispatch]);

  return null;
};

export default UserInitializer;
