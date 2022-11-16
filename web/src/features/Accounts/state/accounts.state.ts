import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { fetchNui } from "../../../utils/fetchNui";
import { isEnvBrowser } from "../../../utils/misc";
import { MockAccounts } from "../utils/constants";
import { Account } from "../../../types/account";

export const accountsState = {
	accounts: atom<any[]>({
		key: 'accountsStateAccounts',
		default: selector({
			key: 'accountsStateAccountsValue',
			get: async () => {
				try {
					const res: any = await fetchNui<{ data: any[] }>('ei-banking:getAccounts');
					
					return res;
				} catch (e) {
					if (isEnvBrowser()) {
						return MockAccounts;
					}
					console.error(e);
					return [];
				}
			}
		})
	}),
	filterInput: atom<string>({
		key: 'defaultAccountsFilter',
		default: '',
	}),
	filteredAccounts: selector({
		key: 'defaultFilteredAccountsValue',
		get: ({ get }) => {
			const searchValue: string = get(accountsState.filterInput);
			const accounts: any[] = get(accountsState.accounts);
			
			const regExp = new RegExp(searchValue, 'gi');
			
			return accounts.filter((acc) => acc.accountName.match(regExp));
		},
	}),
	activeAccount: atom<Account | null>({
		key: 'defaultActiveAccount',
		default: null,
	}),
}

export const useAccounts = () => useRecoilState(accountsState.accounts);
export const useAccountsValue = () => useRecoilValue(accountsState.accounts);
export const useSetAccounts = () => useSetRecoilState(accountsState.accounts);

export const useSetFilterAccounts = () => useSetRecoilState(accountsState.filterInput);
export const useFilterAccountsInput = () => useRecoilState(accountsState.filterInput);

// This is purely used for filtering accounts in the list. We otherwise rely on `useAccountsValue`
export const useFilteredAccountsValue = () => useRecoilValue(accountsState.filteredAccounts);

export const useSetActiveAccount = () => useSetRecoilState(accountsState.activeAccount);
export const useActiveAccountValue = () => useRecoilValue(accountsState.activeAccount);
