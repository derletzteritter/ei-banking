import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useAccountsApi } from "../hooks/useAccountsApi";
import { useTranslation } from 'react-i18next';

interface NewAccountModalProps {
	open: boolean;
	onClose: () => void;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({ open, onClose }) => {
	const [accountName, setAccountName] = useState<string>('');
	const [t] = useTranslation();
	
	const { createAccount } = useAccountsApi();
	
	const handleCreateAccount = () => {
		createAccount(accountName)
		onClose()
	}
	
	const isDisabled = !accountName;
	
	return (
		<Dialog open={open} fullWidth={true} maxWidth="sm" onClose={onClose}>
			<DialogTitle>{t("CREATE_NEW_ACCOUNT")}</DialogTitle>
			<DialogContent>
				<DialogContentText>{t("CREATE_A_NEW_ACCOUNT")}</DialogContentText>
				<TextField
					value={accountName}
					onChange={(e) => setAccountName(e.currentTarget.value)}
					autoFocus
					margin="dense"
					id="name"
					label={t('NEW_ACCOUNT_LABEL')}
					type="text"
					fullWidth
					variant="standard"
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" onClick={onClose}>{t("CANCEL")}</Button>
				<Button variant="contained" disabled={isDisabled} onClick={handleCreateAccount}>{t("CONFIRM")}</Button>
			</DialogActions>
		</Dialog>
	)
}

export default NewAccountModal;