import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

interface DepositModalProps {
	open: boolean;
	onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ open, onClose }) => {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
			<DialogTitle>Deposit money</DialogTitle>
			<DialogContent>
				<DialogContentText>Deposit money to an account.</DialogContentText>
				<TextField
					autoFocus
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
				<Button variant="contained" onClick={onClose}>Confirm</Button>
			</DialogActions>
		</Dialog>
	)
}

export default DepositModal;