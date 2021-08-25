import { Box, IconButton, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import copy from 'copy-to-clipboard';

import { axiosUtil } from '../services/axiosinstance';
import { formatDateTime } from '../services/utils';
import CustomTable from '../common/Table';
import { previousListsStyles } from '../styles/view/previousLists';

export default function PreviousList() {
  const classes = previousListsStyles();
  const { data: response, error } = useSWR('/getAllLists', axiosUtil.get);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [selectedList, setSelectedList] = useState({});

  useEffect(() => {
    if (response?.data?.length > 0) {
      setSelectedRecord(response.data[0]);
      setSelectedList(response.data[0].list[0]);
      setSelectedListIndex(0);
    }
  }, [response?.data]);

  const handleChangeList = e => {
    const { value } = e.target;
    setSelectedRecord(value);
    setSelectedListIndex(0);
    setSelectedList(value.list[0]);
  };

  const copyToClipboard = () => {
    copy(selectedList.accounts.map(record => record.accountno).toString());
  };

  const changeListNo = change => {
    setSelectedList(selectedRecord.list[selectedListIndex + change]);
    setSelectedListIndex(prevState => prevState + change);
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: '15em' },
    { id: 'paidInstallments', label: 'Installments', align: 'center' },
    { id: 'amount', label: 'Amount', align: 'center' },
    { id: 'totalAmount', label: 'Total Amount', minWidth: '10em', align: 'center' },
    { id: 'accountno', label: 'Account No.', minWidth: '8em', align: 'center' },
  ];

  if (error) return <div> Error occured </div>;
  if (!response) return <div> Loading </div>;

  const rows = selectedList?.accounts?.map(acc => acc);
  return (
    <Paper classes={{ root: classes.root }}>
      <Typography variant="h5" className={classes.heading}>
        Previous Lists
      </Typography>
      <TextField
        select
        value={selectedRecord}
        label="Select List"
        onChange={handleChangeList}
        variant="outlined"
      >
        {response.data.map((list, ind) => (
          <MenuItem key={list.createdAt} value={list} selected={ind === 0}>
            {' '}
            {formatDateTime(list.createdAt)}
          </MenuItem>
        ))}
      </TextField>
      <Box mt={2} mb={2} className={classes.listTitleWrapper}>
        <IconButton
          fontSize="medium"
          onClick={() => changeListNo(-1)}
          disabled={selectedListIndex === 0}
        >
          <ArrowLeftIcon />
        </IconButton>
        <Typography component="span" align="center" className={classes.listTitle}>
          {`List ${selectedListIndex + 1}`}
        </Typography>
        <IconButton
          fontSize="medium"
          onClick={() => changeListNo(1)}
          disabled={selectedListIndex === selectedRecord?.list?.length - 1}
        >
          <ArrowRightIcon />
        </IconButton>
      </Box>
      <CustomTable rows={rows || []} columns={columns} />

      <Box mt={2} mb={2}>
        <div className={classes.row}>
          {' '}
          <b>Total Amount : </b>
          <span> {selectedList?.totalAmount} </span>
          {/* <span>{selectedRecord.list[selectedListIndex].totalAmount}</span> */}
        </div>
        <div className={classes.row}>
          {' '}
          <b> Number of Accounts : </b>
          <span>
            {selectedList?.accounts?.length} {'   '}
          </span>
          <IconButton color="primary" onClick={copyToClipboard}>
            <FileCopyIcon />
          </IconButton>
        </div>
      </Box>
    </Paper>
  );
}
