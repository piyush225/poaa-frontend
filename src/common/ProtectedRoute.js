import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAuth } from '../services/Auth';

const ProtectedRoute = ({ children, ...rest }) => {
  const { user } = useAuth();
  const location = useLocation();
  const authToken = window.localStorage.getItem('token');

  return (
    <Route {...rest}>
      {user ? (
        Object.keys(user.customData)?.length || location.pathname === '/user-details' ? (
          children
        ) : (
          <Redirect to={{ pathname: '/user-details', state: { referer: location.pathname } }} />
        )
      ) : (
        <Redirect to={{ pathname: '/login', state: { referer: location.pathname } }} />
      )}
    </Route>
  );
};

export default ProtectedRoute;
