import { fetchNui } from "../../../utils/fetchNui";
import { Account } from "../../../types/account";
import { useAccountsActions } from "./useAccountsActions";

export const useAccountsApi = () => {
	const { createLocalAccount, updateAccountBalance } = useAccountsActions();
	
	const createAccount = (name: string) => {
		fetchNui('ei-banking:createAccount', { name }).then((res) => {
			console.log('new account', res)
			createLocalAccount(res)
		})
	}
	
	const depositMoney = (account: Account, amount: string) => {
		fetchNui('ei-banking:depositMoney', {
			account,
			amount: parseInt(amount, 10)
		}).then((resp) => {
			if (resp.status === 'ok') {
				updateAccountBalance(account.id, resp.data)
			}
		})
	}
	
	const withdrawMoney = (account: Account, amount: string) => {
		fetchNui('ei-banking:withdrawMoney', {
			account,
			amount: parseInt(amount, 10)
		}).then((resp) => {
			if (resp.status === 'ok') {
				updateAccountBalance(account.id, resp.data)
			}
		})
	}
	
	const transferMoney = (sourceAccount: Account, targetAccount: Account | string, amount: string) => {
		fetchNui('ei-banking:transferMoney', {
			sourceAccount,
			targetAccount,
			amount: parseInt(amount, 10)
		}).then((resp) => {
			console.log(resp)
		})
	}
	
	return {
		createAccount,
		depositMoney,
		withdrawMoney,
		transferMoney
	}
}
