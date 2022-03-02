import React from 'react';
import { Box, Button, CircularProgress, styled } from "@mui/material";
import { debugData } from "../../utils/debugData";
import { useCredentialsValue } from "../../state/player.state";
import { headerIcons } from "../../icons/svgProvider";

const Header = styled(Box)({
	marginTop: 20,
	paddingLeft: 10,
	paddingRight: 10,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center'
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

debugData([
	{
		action: 'ei-banking:setCredentials',
		data: {
			charName: 'Chip Chipperson'
		}
	}
])

const SidebarHeader: React.FC = () => {
	const player = useCredentialsValue();
	
	if (!player) {
		return <CircularProgress />
	}
	
	return (
		<Header>
			<PrimaryText>
				{player.charName}
			</PrimaryText>
			<Button variant="contained" size="small" endIcon={headerIcons.exit}>
				Logout
			</Button>
		</Header>
	)
}

export default SidebarHeader;