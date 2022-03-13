import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useActiveAccountValue } from "../../Accounts/state/accounts.state";

interface WithdrawModalProps {
	open: boolean;
	onClose: () => void;
	confirmWithdraw: (amount: string) => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ open, onClose, confirmWithdraw }) => {
	const [amount, setAmount] = useState<string>('')
	const activeAccount = useActiveAccountValue();
	
	const isDisabled = !amount || amount.startsWith('0');
	
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
			<DialogTitle>Withdraw</DialogTitle>
			<DialogContent>
				<DialogContentText>Withdraw money from <span
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
				<Button variant="contained" onClick={() => confirmWithdraw(amount)} disabled={isDisabled}>Confirm</Button>
			</DialogActions>
		</Dialog>
	)
}

export default WithdrawModal;