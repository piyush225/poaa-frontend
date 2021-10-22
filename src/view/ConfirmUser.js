import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { triggerAlert } from '../services/getAlert/getAlert';
import handleError from '../services/handleError';
import { useAuth } from '../services/Auth';

export default function ConfirmUser() {
  const { app } = useAuth();
  const { search } = useLocation();
  const history = useHistory();
  const token = new URLSearchParams(search).get('token');
  const tokenId = new URLSearchParams(search).get('tokenId');
  useEffect(() => {
    async function confirmUser() {
      try {
        await app.emailPasswordAuth.confirmUser(token, tokenId);
        triggerAlert({ icon: 'success', title: "You're verified" });
      } catch (error) {
        handleError(error, triggerAlert);
      } finally {
        history.push('/');
      }
    }
    confirmUser();
  }, []);

  return (
    <Typography variant="h6" align="center">
      {' '}
      Thank you for Registering! Wait while we are confirming your email Id.{' '}
    </Typography>
  );
}