import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useAccountsApi } from "../hooks/useAccountsApi";

interface NewAccountModalProps {
	open: boolean;
	onClose: () => void;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({ open, onClose }) => {
	const [accountName, setAccountName] = useState<string>('');
	
	const { createAccount } = useAccountsApi();
	
	const handleCreateAccount = () => {
		createAccount(accountName)
		onClose()
	}
	
	return (
		<Dialog open={open} fullWidth={true} maxWidth="sm" onClose={onClose}>
			<DialogTitle>Create new account</DialogTitle>
			<DialogContent>
				<DialogContentText>Create a new account</DialogContentText>
				<TextField
					value={accountName}
					onChange={(e) => setAccountName(e.currentTarget.value)}
					autoFocus
					margin="dense"
					id="name"
					label="Name of account"
					type="text"
					fullWidth
					variant="standard"
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" onClick={onClose}>Cancel</Button>
				<Button variant="contained" onClick={handleCreateAccount}>Confirm</Button>
			</DialogActions>
		</Dialog>
	)
}

export default NewAccountModal;