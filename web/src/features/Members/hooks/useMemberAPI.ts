import { fetchNui } from '../../../utils/fetchNui';
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useSetMembersState } from "../state/members.state";

export const useMemberAPI = () => {
	const { enqueueSnackbar } = useSnackbar();
	const setMembers = useSetMembersState();
	
	const updateAccountMember = (data: any) => {
		fetchNui('ei-banking:updateMemberPermissions', data).then((resp) => {
			if (resp.status !== 'ok') {
				return enqueueSnackbar("Failed to update member")
			}

			console.log("updating member resp data", resp.data)

			setMembers((curVal) => curVal.map((member) => {
					if (member.citizen === resp.data.citizenid) {
						return {
							...member,
							canDeposit: resp.data.canDeposit,
							canWithdraw: resp.data.canWithdraw,
							canTransfer: resp.data.canTransfer,
						}
					}

					return member;
			}))
		})
	}
	
	const createAccountMember = (data: any) => {
		fetchNui('ei-banking:addAccountMember', data).then((resp) => {
			if (resp.status !== 'ok') {
				return enqueueSnackbar(resp.data.message, { variant: 'error' })
			}
			
			// do some stuff
			setMembers((curVal) => [...curVal, resp.data])
		})
	}
	
	const deleteAccountMember = (data: any) => {
		fetchNui('ei-banking:deleteAccountMember', data).then((resp) => {
			if (resp.status !== 'ok') {
			
			}
			
			// do some stuff
		})
	}
	
	const getMembers = useCallback((accountId) => {
		console.log("fetching that bitch")
		console.log("accountid", accountId);
		fetchNui('ei-banking:getMembers', { accountId }).then((res) => {
			if (res.status !== 'ok') {
				return;
			}
			
			console.log("HELLO BRO", res.data);
			setMembers(res.data);
		})
	}, [setMembers])
	
	return { updateAccountMember, createAccountMember, getMembers }
}
