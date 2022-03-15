import { Account, AccountType } from "../../../types/account";

export const MockAccounts: Account[] = [
	{
		id: 1,
		accountName: 'Default account',
		balance: '45.00',
		owner: true,
		isDefault: true,
		type: AccountType.Personal,
	},
	{
		id: 2,
		accountName: 'Savings',
		balance: '9654.00',
		owner: true,
		isDefault: false,
		type: AccountType.Personal,
	},
	{
		id: 3,
		accountName: 'google_was_my_idea',
		balance: '0.00',
		owner: false,
		isDefault: false,
		type: AccountType.Shared,
	},
];