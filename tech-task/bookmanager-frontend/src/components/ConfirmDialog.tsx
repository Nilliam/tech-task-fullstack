import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const useConfirmDialog = (message: string = "Are you sure?", okText = "Yes", cancelText = "No") => {
  const [open, setOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => {});

  const confirm = () => {
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve); 
    });
  };

  const handleClose = (confirmed: boolean) => {
    setOpen(false);
    resolvePromise(confirmed); 
  };

  const ConfirmDialog = () => (
    <Dialog PaperProps={{
        sx: {
          width: '60vw',  
          height: '30vh',
        },
      }} open={open} onClose={() => handleClose(false)}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>{cancelText}</Button>
        <Button onClick={() => handleClose(true)} autoFocus>{okText}</Button>
      </DialogActions>
    </Dialog>
  );

  return { confirm, ConfirmDialog };
};

export default useConfirmDialog;
