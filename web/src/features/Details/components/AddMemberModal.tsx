import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useActiveAccountValue } from "../../Accounts/state/accounts.state";
import { useTranslation } from 'react-i18next';

interface AddMemberModalProps {
	open: boolean;
	onClose: () => void;
	confirmMember: (amount: number) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ open, onClose, confirmMember }) => {
	const [member, setMember] = useState<string>('');
	const [t] = useTranslation();
	
	const activeAccount = useActiveAccountValue();
	
	const isDisabled = !member.trim();
	
	const handleOnClose = () => {
		setMember('');
		onClose();
	}
	
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
			<DialogTitle>{t("MEMBER_MODAL_TITLE")}</DialogTitle>
			<DialogContent>
				<DialogContentText>{t("ADD_MEMBER_TO_ACCOUNT")}{' '}<span
					style={{ fontWeight: 'bold' }}>{activeAccount?.accountName}</span></DialogContentText>
				<TextField
					autoFocus
					value={member}
					onChange={(e) => setMember(e.currentTarget.value)}
					margin="dense"
					id="name"
					type="number"
					label={t("SOURCE")}
					fullWidth
					variant="standard"
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" onClick={handleOnClose}>{t("CANCEL")}</Button>
				<Button variant="contained" onClick={() => confirmMember(parseInt(member, 10))} disabled={isDisabled}>{t("CONFIRM")}</Button>
			</DialogActions>
		</Dialog>
	)
}
