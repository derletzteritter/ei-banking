import React from 'react';
import { Account } from "../../../types/account";
import { Box, styled } from "@mui/material";

const ItemWrapper = styled(Box)({
	background: '#42464A',
	color: '#fff',
	height: '60px',
	boxSizing: 'border-box',
	borderRadius: 7,
	paddingLeft: 10,
	paddingTop: 5,
	display: 'flex',
	flexDirection: 'column',
})

const PrimaryText = styled('p')({
	fontWeight: 500,
	margin: 0,
	color: '#fff',
	whiteSpace: 'nowrap',
	width: '200px',
	overflow: 'hidden',
	textOverflow: 'ellipsis'
});

const TypeText = styled('p')({
	fontWeight: 'normal',
	margin: 0,
	color: '#B5B5B5',
	fontSize: 14,
	paddingRight: 5
});

const SecondaryText = styled('p')({
	fontWeight: 'normal',
	margin: 0,
	marginTop: 4,
	color: '#B5B5B5',
	fontSize: 14,
});

const AccountItem: React.FC<Account> = (account) => {
	return (
		<ItemWrapper>
			<Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 0}}>
				<PrimaryText>{account.accountName}</PrimaryText>
				<TypeText>{account.type}</TypeText>
			</Box>
			<Box>
				<SecondaryText>{account.balance}</SecondaryText>
			</Box>
		</ItemWrapper>
	)
}

export default AccountItem;