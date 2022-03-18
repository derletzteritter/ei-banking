import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField
} from "@mui/material";
import { Account } from "../../../types/account";
import { useActiveAccountValue } from "../../Accounts/state/accounts.state";

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  confirmTransfer: (targetAccount: Account, amount: string) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ open, onClose, confirmTransfer }) => {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState<Account>(null);
  
  const activeAccount = useActiveAccountValue();
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>Deposit</DialogTitle>
      <DialogContent>
        <DialogContentText>Deposit money to <span
          style={{ fontWeight: 'bold' }}>{activeAccount?.accountName}</span></DialogContentText>
        <TextField
          autoFocus
          value={amount}
          onChange={(e) => setAmount(e.currentTarget.value)}
          margin="dense"
          id="name"
          label="Amount"
          type="number"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => confirmTransfer(account, amount)}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransferModal;
