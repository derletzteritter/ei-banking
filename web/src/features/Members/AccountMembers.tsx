import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import Member from './Member';
import { useMemberAPI } from './hooks/useMemberAPI';
import { useMembersValue } from "./state/members.state";
import { useCredentialsValue } from "../../state/player.state";

const AccountMembers = () => {
    const { updateAccountMember, deleteAccountMember } = useMemberAPI();
    const membersValue = useMembersValue();
    const player = useCredentialsValue();

    const handleUpdateMember = useCallback((data: any) => {
        updateAccountMember(data)
    }, [updateAccountMember])
    
    
	const handleDeleteMember = (member: any) => {
		deleteAccountMember(member)
	}
    
    if (!membersValue) return null;

    return (
        <Box>
            {membersValue.filter((b) => b.citizenId !== player.citizenId).map((member: any) => (
                <Member key={member.citizenId} member={member} updateMember={handleUpdateMember} deleteMember={handleDeleteMember} />
            ))}
        </Box>
    )
}

export default AccountMembers;
