import { useSetAccounts } from "../state/accounts.state";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { Account } from "../../../types/account";

export const useAccountListener = () => {
	const setAccounts = useSetAccounts();
	
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
}