import { useRecoilCallback } from 'recoil';
import { accountsState } from "../state/accounts.state";
import { Account } from "../../../types/account";

interface IUseAccountActions {
	findAccountById: (id: string) => Account | null;
	getDefaultAccount: () => Account;
}

export const useAccountsActions = (): IUseAccountActions => {
	const findAccountById = useRecoilCallback<[string], Account | null>(
		({ snapshot }) =>
			(id: string) => {
				const { state, contents } = snapshot.getLoadable(accountsState.accounts);
				
				if (state !== 'hasValue') return;
				
				for (const account of contents) {
					if (account.id === id) return account;
				}
				
				return null;
			},
		[],
	);
	
	const getDefaultAccount = useRecoilCallback(
		({ snapshot }) =>
			() => {
				const { state, contents } = snapshot.getLoadable(accountsState.accounts);
				
				if (state !== 'hasValue') return;
				
				for (const account of contents) {
					if (account.isDefault) return account;
				}
			},
		[],
	);
	
	return { findAccountById, getDefaultAccount };
};