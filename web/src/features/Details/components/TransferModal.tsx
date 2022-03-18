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
  confirmTransfer: (targetAccount: Account, amount: string) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ open, onClose, confirmTransfer }) => {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState<Account>(null);
  const accounts = useAccountsValue();
  
  const activeAccount = useActiveAccountValue();
  
  const isDisabled = !amount || !account;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>Transfer</DialogTitle>
      <DialogContent>
        <DialogContentText>Transer money to an account from <span
          style={{ fontWeight: 'bold' }}>{activeAccount?.accountName}</span></DialogContentText>
        <Autocomplete
          options={accounts}
          getOptionLabel={(acc) => acc.accountName}
          renderInput={(params) => <TextField {...params} variant="standard"/>}
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
        <Button variant="contained" onClick={() => confirmTransfer(account, amount)} disabled={isDisabled}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransferModal;
