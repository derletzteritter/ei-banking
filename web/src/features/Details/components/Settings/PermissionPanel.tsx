import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import AccountMembers from '../../../Members/AccountMembers';
import { AddMemberModal } from "../AddMemberModal";

const PermissionPanel: React.FC = () => {
	const [memberModal, setMemberModal] = useState<boolean>(false);
	
	const handleOpenMemberModal = () => {
		setMemberModal(true);
	}
	
	return (
		<Box>
			<Box mb={2}>
				<Button size="small" variant="contained" onClick={handleOpenMemberModal}>
					Add member
				</Button>
			</Box>
			<AddMemberModal open={memberModal} onClose={() => setMemberModal(false)} confirmMember={(m) => console.log(m)} />
			<AccountMembers />
		</Box>
	)
}

export default PermissionPanel;
