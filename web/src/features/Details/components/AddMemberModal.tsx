import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useActiveAccountValue } from "../../Accounts/state/accounts.state";

interface AddMemberModalProps {
	open: boolean;
	onClose: () => void;
	confirmMember: (amount: number) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ open, onClose, confirmMember }) => {
	const [member, setMember] = useState<string>('');
	
	const activeAccount = useActiveAccountValue();
	
	const isDisabled = !member.trim();
	
	const handleOnClose = () => {
		setMember('');
		onClose();
	}
	
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
			<DialogTitle>Member actions</DialogTitle>
			<DialogContent>
				<DialogContentText>Add member to <span
					style={{ fontWeight: 'bold' }}>{activeAccount?.accountName}</span></DialogContentText>
				<TextField
					autoFocus
					value={member}
					onChange={(e) => setMember(e.currentTarget.value)}
					margin="dense"
					id="name"
					type="number"
					label="Source"
					fullWidth
					variant="standard"
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" onClick={handleOnClose}>Cancel</Button>
				<Button variant="contained" onClick={() => confirmMember(parseInt(member, 10))} disabled={isDisabled}>Confirm</Button>
			</DialogActions>
		</Dialog>
	)
}
