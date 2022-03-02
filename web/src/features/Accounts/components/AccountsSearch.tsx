import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from "@mui/material";
import { Search, SearchIconWrapper, StyledInputBase } from "../styles/Accounts.styles";
import { useFilterAccountsInput } from "../state/accounts.state";

const AccountsSearch: React.FC = () => {
	const [filter, setFilter] = useFilterAccountsInput();
	
	return (
		<Box pt={2}>
			<Search>
				<SearchIconWrapper>
					<SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
					value={filter}
					onChange={(e) => setFilter(e.currentTarget.value)}
					placeholder="Search for accounts…"
					inputProps={{ 'aria-label': 'search' }}
				/>
			</Search>
		</Box>
	)
}

export default AccountsSearch;