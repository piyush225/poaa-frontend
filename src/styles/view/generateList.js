import { makeStyles } from '@material-ui/core';

export const generateListStyles = makeStyles(theme => ({
  root: {
    minWidth: '70vw',
    padding: theme.spacing(2),
  },
  generateButtonWrapper: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'center',
  },
}));