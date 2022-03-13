import React from 'react'
import { Autocomplete, TextField } from "@mui/material";
import { Account } from "../types/account";

interface AccountAutocompleteProps {
	accounts: Account[]
}

export const AccountAutocomplete: React.FC<AccountAutocompleteProps> = ({ accounts }) => {
	
	return (
		<Autocomplete
			options={accounts}
			getOptionLabel={(acc) => acc.accountName}
			sx={{ color: '#fff' }}
			renderInput={(params) => <TextField label="Account" variant="standard" {...params} fullWidth/>}
		/>
	)
}