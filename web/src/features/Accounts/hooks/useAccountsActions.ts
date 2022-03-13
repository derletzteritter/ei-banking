import { useRecoilCallback } from 'recoil';
import { accountsState, useSetAccounts } from "../state/accounts.state";
import { Account } from "../../../types/account";
import { useCallback } from "react";

interface IUseAccountActions {
	findAccountById: (id: string) => Account | null;
	getDefaultAccount: () => Account;
	createLocalAccount: (account: Account) => void;
	updateAccountBalance: (accountId: string, newBalance: number) => void;
}

export const useAccountsActions = (): IUseAccountActions => {
	const setAccounts = useSetAccounts();
	
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
	
	const createLocalAccount = useCallback((account: Account) => {
		setAccounts((curAcc) => [...curAcc, account])
	}, [setAccounts])
	
	const updateAccountBalance = (accountId: string, newBalance: number) => {
		// eslint-disable-next-line array-callback-return
		setAccounts((curAcc: Account[]) => curAcc.map((acc) => {
			if (acc.id === accountId) {
				return {
					...acc,
					balance: newBalance
				}
			}
		}))
	}
	
	return { findAccountById, getDefaultAccount, createLocalAccount, updateAccountBalance };
};