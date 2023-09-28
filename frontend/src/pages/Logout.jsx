import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/redux/auth/actions';
import PageLoader from '@/components/PageLoader';
const Logout = () => {
  const dispatch = useDispatch();

  const asyncLogout = useCallback(() => {
    return dispatch(logoutAction());
  }, [dispatch]);

  useEffect(() => {
    asyncLogout();
  }, [asyncLogout]);

  return <PageLoader />;
};
export default Logout;
