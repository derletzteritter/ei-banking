import React from 'react';
import { Box, CircularProgress } from "@mui/material";
import { useActiveAccountValue } from "../Accounts/state/accounts.state";
import { AccountBalance, AccountName } from "./styles/Details.styles";

const AccountDetails: React.FC = () => {
	const activeAccount = useActiveAccountValue();
	
	if (!activeAccount) {
		return <CircularProgress />
	}
	
	return (
		<Box ml={2}>
			<Box>
				<AccountName>{activeAccount.accountName}</AccountName>
				<AccountBalance>{activeAccount.balance}</AccountBalance>
			</Box>
		</Box>
	)
}

export default AccountDetails;