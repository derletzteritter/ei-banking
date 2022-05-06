import { useSetAccounts } from "../state/accounts.state";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { Account } from "../../../types/account";
import { useAccountsActions } from "./useAccountsActions";

export const useAccountListener = () => {
	const setAccounts = useSetAccounts();
	const { updateAccountBalance } = useAccountsActions();
	
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
}
