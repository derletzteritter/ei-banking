import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useActiveAccountValue } from "../../Accounts/state/accounts.state";
import { useTranslation } from 'react-i18next';

interface DepositModalProps {
	open: boolean;
	onClose: () => void;
	confirmDeposit: (amount: string) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ open, onClose, confirmDeposit }) => {
	const [amount, setAmount] = useState<string>('')
	const activeAccount = useActiveAccountValue();
	const [t] = useTranslation();
	
	const isDisabled = !amount || amount.startsWith('0');
	
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
			<DialogTitle>{t("DEPOSIT_MODAL_TITLE")}</DialogTitle>
			<DialogContent>
				<DialogContentText>{t("DEPOSIT_MONEY_TO")}{' '}<span
					style={{ fontWeight: 'bold' }}>{activeAccount?.accountName}</span></DialogContentText>
				<TextField
					autoFocus
					value={amount}
					onChange={(e) => setAmount(e.currentTarget.value)}
					margin="dense"
					id="name"
					label={t("AMOUNT")}
					type="number"
					fullWidth
					variant="standard"
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" onClick={onClose}>{t("CANCEL")}</Button>
				<Button variant="contained" onClick={() => confirmDeposit(amount)} disabled={isDisabled}>{t("CONFIRM")}</Button>
			</DialogActions>
		</Dialog>
	)
}

export default DepositModal;