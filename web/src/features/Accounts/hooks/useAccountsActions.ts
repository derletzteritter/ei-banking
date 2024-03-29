import { useRecoilCallback } from 'recoil';
import { accountsState, useSetAccounts } from "../state/accounts.state";
import { Account } from "../../../types/account";
import { useCallback } from "react";

interface IUseAccountActions {
	findAccountById: (id: string) => Account | null;
	getDefaultAccount: () => Account;
	createLocalAccount: (account: Account) => void;
	deleteLocalAccount: (accountId: number) => void;
	updateAccountBalance: (accountId: number, newBalance: number) => void;
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
				
				return null
			},
		[],
	);
	
	const createLocalAccount = useCallback((account: Account) => {
		setAccounts((curAcc) => [...curAcc, account])
	}, [setAccounts])

	const deleteLocalAccount = useCallback((accountId: number) => {
		setAccounts((curAcc) => [...curAcc].filter((acc) => acc.id !== accountId));
	}, [setAccounts])
	
	const updateAccountBalance = (accountId: number, newBalance: number) => {
		setAccounts((curAcc: Account[]) => curAcc.map((acc) => {
			if (acc.id === accountId) {
				return {
					...acc,
					balance: newBalance
				}
			}
			
			return acc;
		}))
	}
	
	return { findAccountById, getDefaultAccount, createLocalAccount, updateAccountBalance, deleteLocalAccount };
};