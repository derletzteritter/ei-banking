import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { AccountAutocomplete } from "../../../components/AccountAutocomplete";
import { useAccountsValue, useActiveAccountValue } from "../../Accounts/state/accounts.state";

interface DepositModalProps {
	open: boolean;
	onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ open, onClose }) => {
	const [amount, setAmount] = useState<string>('')
	const activeAccount = useActiveAccountValue();
	
	const isDisabled = !amount || amount.startsWith('0');
	
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
				<Button variant="contained" onClick={onClose} disabled={isDisabled}>Confirm</Button>
			</DialogActions>
		</Dialog>
	)
}

export default DepositModal;