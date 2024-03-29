import { Grid, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import { useHistory } from 'react-router-dom';
import { Warning } from '@material-ui/icons';

import Controls from '../common/controls/Controls';
import { Form, useForm } from '../common/useForm';
import { loginStyles } from '../styles/view/login';
import { useAuth } from '../services/Auth';
import handleError from '../services/handleError';
import { triggerAlert } from '../services/getAlert/getAlert';

const crypto = require('crypto');

const initialValues = {
  name: '',
  pAccountNo: '',
  pPassword: '',
};

export default function UserDetailsForm() {
  const classes = loginStyles();
  const { client, user } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState();
  const validate = (fieldValues = values) => {
    const temp = { ...errors };
    if ('name' in fieldValues) temp.name = fieldValues.name.length > 0 ? '' : 'Enter your name';
    if ('pAccountNo' in fieldValues)
      temp.pAccountNo = fieldValues.pAccountNo.length > 0 ? '' : 'Enter Portal Account No';
    if ('pPassword' in fieldValues)
      temp.pPassword = fieldValues.pPassword.length > 0 ? '' : 'Enter your Portal Password';
    setErrors({ ...temp });
  };
  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    initialValues,
    true,
    validate
  );

  useEffect(() => {
    const refreshUserData = async () => {
      await user.refreshCustomData();
      setValues({
        name: user?.customData?.name,
        pAccountNo: user?.customData?.pAccountNo,
        pPassword: user?.customData?.pPassword,
      });
    };
    refreshUserData();
  }, [user, setValues]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const collection = await client.db('poaa').collection('users');
      await collection.updateOne(
        { userId: user.id },
        {
          $set: {
            ...values,
            ...user.profile,
            pPassword: encrypt(values.pPassword),
            userId: user.id,
          },
        },
        { upsert: true }
      );
      await user.refreshCustomData();

      window.localStorage.setItem('token', user.accessToken);
      history.push('/');
    } catch (error) {
      handleError(error, triggerAlert);
      setLoading(false);
    }
  };

  const encrypt = data => {
    const mykey = crypto.createCipher(
      process.env.REACT_APP_ENCRYPT_ALGO,
      process.env.REACT_APP_ENCRYPT_SALT
    );
    let mystr = mykey.update(data, 'utf-8', 'hex');
    mystr += mykey.final('hex');
    return mystr;
  };

  const needToChange = () => {
    return !user?.customData?.pPassword?.length;
  };

  return (
    <Paper className={classes.pageContent}>
      <Form onSubmit={handleSubmit}>
        <Grid container justifyContent="center">
          <Typography variant="h5" classes={{ root: classes.titleRoot }}>
            Update Details
          </Typography>
          <Grid container item xs={12} justifyContent="center">
            <Controls.Input
              variant="outlined"
              label="Name"
              name="name"
              required
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
              classes={{ root: classes.inputRoot }}
              disabled={!needToChange()}
            />

            <Controls.Input
              variant="outlined"
              label="Portal Account No"
              name="pAccountNo"
              required
              value={values.pAccountNo}
              onChange={handleInputChange}
              error={errors.pAccountNo}
              classes={{ root: classes.inputRoot }}
              disabled={!needToChange()}
            />

            <Controls.Input
              variant="outlined"
              type="password"
              label="Portal Current Password"
              name="pPassword"
              required
              value={values.pPassword}
              onChange={handleInputChange}
              error={errors.pPassword}
              classes={{ root: classes.inputRoot }}
              disabled={!needToChange()}
            />

            <Controls.Button
              type="submit"
              text={<KeyboardArrowRightRoundedIcon />}
              disabled={loading || !needToChange()}
              classes={{ root: classes.buttonRoot }}
            />
          </Grid>
          {!needToChange() && (
            <Grid container justifyContent="center" alignItems="center">
              <Warning fontSize="small" />
              <Typography variant="subtitle2" align="center">
                No need to change details.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Form>
    </Paper>
  );
}
