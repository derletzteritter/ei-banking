import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import AccountMembers from '../../../Members/AccountMembers';
import { AddMemberModal } from "../AddMemberModal";
import { useMemberAPI } from "../../../Members/hooks/useMemberAPI";
import { useActiveAccountValue } from "../../../Accounts/state/accounts.state";
import { useTranslation } from 'react-i18next';

const PermissionPanel: React.FC = () => {
	const [memberModal, setMemberModal] = useState<boolean>(false);
	const { createAccountMember } = useMemberAPI();
	const activeAccount = useActiveAccountValue();

	const [t] = useTranslation();
	
	const handleOpenMemberModal = () => {
		setMemberModal(true);
	}
	
	const handleConfirmMember = (member: number) => {
		createAccountMember({ member: member, accountId: activeAccount.id })
	}

	
	return (
		<Box>
			<Box mb={2}>
				<Button size="small" variant="contained" onClick={handleOpenMemberModal}>
					{t("ADD_MEMBER")}
				</Button>
			</Box>
			<AddMemberModal open={memberModal} onClose={() => setMemberModal(false)} confirmMember={handleConfirmMember} />
			<AccountMembers />
		</Box>
	)
}

export default PermissionPanel;
