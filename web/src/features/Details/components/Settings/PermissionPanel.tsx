import React from 'react';
import { Box, Typography } from "@mui/material";

const PermissionPanel: React.FC = () => {
	return (
		<Box>
			<Typography>Permissions</Typography>
			<Box>
				<Typography>Change permissions for stuff</Typography>
			</Box>
		</Box>
	)
}

export default PermissionPanel;