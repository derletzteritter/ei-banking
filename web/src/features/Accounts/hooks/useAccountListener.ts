import { useAccountsValue, useSetAccounts, useSetActiveAccount } from "../state/accounts.state";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { Account } from "../../../types/account";
import { useAccountsActions } from "./useAccountsActions";

export const useAccountListener = () => {
	const setAccounts = useSetAccounts();
	const setActiveAccount = useSetActiveAccount();
	const accounts = useAccountsValue();
	const { updateAccountBalance, createLocalAccount, deleteLocalAccount } = useAccountsActions();
	
	useNuiEvent("SyncDefaultAccount", (newBalance) => {
		// eslint-disable-next-line array-callback-return
		setAccounts((curAcc: Account[]) => curAcc.map((acc) => {
			if (acc.isDefault) {
				return {
					...acc,
					balance: newBalance
				}
			}
			
			return acc;
		}))
	})
	
	useNuiEvent('ei-banking:transferBroadcast', ({ accountId, newBalance }) => {
		updateAccountBalance(accountId, newBalance);
	})
	
	useNuiEvent('ei-banking:addMemberBroadcast', (account) => {
		createLocalAccount(account)
	})

	useNuiEvent('ei-banking:deleteAccountSuccess', (accountId) => {
		deleteLocalAccount(accountId);
		setActiveAccount(accounts[0]);
	})

	useNuiEvent('ei-banking:sendAccounts', (accounts) => {
		setAccounts(accounts)
	})
}