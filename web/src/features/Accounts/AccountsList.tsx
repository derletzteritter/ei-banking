import React, { memo } from 'react';
import { Box, CircularProgress } from "@mui/material";
import { Account, AccountType } from "../../types/account";
import AccountItem from "./components/AccountItem";

interface AccountsListProps {
	accounts: Account[];
	handleChangeAccount: (account: Account) => void;
}

const AccountsList: React.FC<AccountsListProps> = ({ accounts, handleChangeAccount }) => {
	if (!accounts) {
		return (
			<CircularProgress />
		)
	}
	
	return (
		<Box style={{
			marginRight: 10,
			marginLeft: 10,
			marginTop: 20,
			userSelect: 'none',
			display: 'flex',
			flexDirection: 'column',
			gridGap: 5
		}}>
			{accounts.map((account) => (
				<AccountItem account={account} handleChangeAccount={handleChangeAccount} />
			))}
		</Box>
	)
}

export default memo(AccountsList)