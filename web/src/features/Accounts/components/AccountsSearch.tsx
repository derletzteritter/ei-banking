import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from "@mui/material";
import { Search, SearchIconWrapper, StyledInputBase } from "../styles/Accounts.styles";
import { useFilterAccountsInput } from "../state/accounts.state";
import { useTranslation } from 'react-i18next';

const AccountsSearch: React.FC = () => {
	const [filter, setFilter] = useFilterAccountsInput();
	const [t] = useTranslation();
	
	return (
		<Box pt={2}>
			<Search>
				<SearchIconWrapper>
					<SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
					value={filter}
					onChange={(e) => setFilter(e.currentTarget.value)}
					placeholder={t("SEARCH_ACCOUNTS_PLACEHOLDER")}
					inputProps={{ 'aria-label': 'search' }}
				/>
			</Search>
		</Box>
	)
}

export default AccountsSearch;