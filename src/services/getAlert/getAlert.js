import Swal from 'sweetalert2/src/sweetalert2';
import '@sweetalert2/theme-dark/dark.css';
import axios from 'axios';
import { mutate } from 'swr';

import './styles.css';
import config from '../config';
import handleError from '../handleError';

const getAlert = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    background: '#10116E',
    timerProgressBar: true,
    onOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  return Toast;
};

export const triggerAlert = data => {
  const toast = getAlert();
  toast.fire(data);
};

export const deleteTrigger = accountno => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    background: '#3454d1',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(result => {
    if (result.value) {
      axios
        .delete(`${config.apiUrl}/api/deleteaccount`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${window.localStorage.getItem('token')}`,
          },
          data: { accountno },
        })
        .then(() => {
          mutate(`${config.apiUrl}/api/allaccounts`);
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
            background: '#3454d1',
          });
        })
        .catch(err => handleError(err, triggerAlert));
    }
  });
};

export default getAlert;
