import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet} from 'react-router-dom';

export const PrivateRouteAuthorized = () => {
  // Проверяем аутентификацию пользователя
  const userData = useSelector(state => state.updateUser)
  const lengthUserData = Object.keys(userData).length
    return(
        lengthUserData===0? <Outlet /> : <Navigate to="/person_account" />
    );
}