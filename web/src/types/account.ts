export enum AccountType {
	Personal = 'personal',
	Shared = 'shared',
}

export type PreDBAccount = {
	accountName: string;
};

export interface Account {
	id: string;
	accountName: string;
	type: AccountType;
	balance: string;
	owner: boolean;
	isDefault: boolean;
}

export interface DepositDTO {
	tgtAccount: Account;
	amount: number;
	message: string;
}