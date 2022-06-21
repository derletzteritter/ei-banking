import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import Member from './Member';
import { useMemberAPI } from './hooks/useMemberAPI';
import { useMembersValue } from "./state/members.state";
import { useCredentialsValue } from "../../state/player.state";

const membersMock = [
    {
        id: 1,
        name: "Rick",
        citizenId: "324dsd",
        canDeposit: false,
        canWithdraw: true,
        canTransfer: false,
    },
    {
        id: 1,
        name: "Taso",
        citizenId: "welku7",
        canDeposit: true,
        canWithdraw: false,
        canTransfer: true,
    },
]

const AccountMembers = () => {
    const { updateAccountMember } = useMemberAPI();
    const membersValue = useMembersValue();
    const player = useCredentialsValue();

    const handleUpdateMember = useCallback((data: any) => {
        updateAccountMember(data)
    }, [updateAccountMember])
    
    if (!membersValue) return null;

    return (
        <Box>
            {membersValue.filter((b) => b.citizenId !== player.citizenId).map((member: any) => (
                <Member key={member.citizenId} member={member} updateMember={handleUpdateMember} />
            ))}
        </Box>
    )
}

export default AccountMembers;
