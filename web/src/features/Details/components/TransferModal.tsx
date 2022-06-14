import React, { useState } from "react";
import {
  Autocomplete,
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
import { useAccountsValue, useActiveAccountValue } from "../../Accounts/state/accounts.state";

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  confirmTransfer: (targetAccount: Account | string, amount: string) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ open, onClose, confirmTransfer }) => {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState<Account | string>(null);
  const accounts = useAccountsValue();
  
  const activeAccount = useActiveAccountValue();
  
  const isDisabled = !amount || !account;
  
  const handleTransfer = () => {
    confirmTransfer(account, amount)
  }
  
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>Transfer</DialogTitle>
      <DialogContent>
        <DialogContentText>Transer money to an account from <span
          style={{ fontWeight: 'bold' }}>{activeAccount?.accountName}</span></DialogContentText>
        <Autocomplete
          freeSolo
          options={accounts.filter((acc) => acc.id !== activeAccount.id)}
          onChange={(e, val) => setAccount(val)}
          getOptionLabel={(acc) => acc.accountName}
          renderInput={(params) => <TextField {...params} variant="standard" onChange={(e) => setAccount(e.currentTarget.value)}/>}
        />
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
        <Button variant="contained" onClick={handleTransfer} disabled={isDisabled}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransferModal;
