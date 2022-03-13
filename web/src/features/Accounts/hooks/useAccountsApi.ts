import { fetchNui } from "../../../utils/fetchNui";
import { useAccountsActions } from "./useAccountsActions";

export const useAccountsApi = () => {
	const { createLocalAccount } = useAccountsActions();
	
	const createAccount = (name: string) => {
		fetchNui('ei-banking:createAccount', { name }).then((res) => {
			console.log('new account', res)
			createLocalAccount(res)
		})
	}
	
	return {
		createAccount
	}
}