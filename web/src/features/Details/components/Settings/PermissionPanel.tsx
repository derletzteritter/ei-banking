import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import AccountMembers from '../../../Members/AccountMembers';
import { AddMemberModal } from "../AddMemberModal";
import { useMemberAPI } from "../../../Members/hooks/useMemberAPI";
import { useActiveAccountValue } from "../../../Accounts/state/accounts.state";

const PermissionPanel: React.FC = () => {
	const [memberModal, setMemberModal] = useState<boolean>(false);
	const { createAccountMember } = useMemberAPI();
	const activeAccount = useActiveAccountValue();
	
	const handleOpenMemberModal = () => {
		setMemberModal(true);
	}
	
	const handleConfirmMember = (member: number) => {
		createAccountMember({ memberSource: member, accountId: activeAccount.id })
	}
	
	return (
		<Box>
			<Box mb={2}>
				<Button size="small" variant="contained" onClick={handleOpenMemberModal}>
					Add member
				</Button>
			</Box>
			<AddMemberModal open={memberModal} onClose={() => setMemberModal(false)} confirmMember={handleConfirmMember} />
			<AccountMembers />
		</Box>
	)
}

export default PermissionPanel;
