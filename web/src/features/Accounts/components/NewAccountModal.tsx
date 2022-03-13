import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

interface NewAccountModalProps {
	open: boolean;
	onClose: () => void;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({ open, onClose }) => {
	return (
		<Dialog open={open} fullWidth={true} maxWidth="sm" onClose={onClose}>
			<DialogTitle>Create new account</DialogTitle>
			<DialogContent>
				<DialogContentText>Create a new account</DialogContentText>
				<TextField
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
				<Button variant="contained" onClick={onClose}>Confirm</Button>
			</DialogActions>
		</Dialog>
	)
}

export default NewAccountModal;