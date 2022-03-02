import React, { useCallback, useEffect } from 'react';
import { Box } from "@mui/material";
import AccountsSearch from "./components/AccountsSearch";
import { useFilteredAccountsValue, useSetActiveAccount } from "./state/accounts.state";
import AccountsList from "./AccountsList";
import { useAccountsActions } from "./hooks/useAccountsActions";
import { Account } from "../../types/account";
import SidebarHeader from "./SidebarHeader";

const Accounts: React.FC = () => {
	const accounts = useFilteredAccountsValue();
	const setActiveAccount = useSetActiveAccount();
	
	const { getDefaultAccount } = useAccountsActions();
	
	useEffect(() => {
		const account = getDefaultAccount();
		setActiveAccount(account);
	}, [setActiveAccount, getDefaultAccount]);
	
	const handleChangeAccounts = useCallback(
		(account: Account) => {
			setActiveAccount(account);
		},
		[setActiveAccount],
	);
	
	return (
		<Box>
			<SidebarHeader />
			<AccountsSearch/>
			<AccountsList accounts={accounts} handleChangeAccount={handleChangeAccounts} />
		</Box>
	)
}

export default Accounts;