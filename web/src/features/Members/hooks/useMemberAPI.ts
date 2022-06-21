import { fetchNui } from '../../../utils/fetchNui';
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useSetMembersState } from "../state/members.state";

export const useMemberAPI = () => {
	const { enqueueSnackbar } = useSnackbar();
	const setMembers = useSetMembersState();
	
	const updateAccountMember = (data: any) => {
		fetchNui('ei-banking:updateAccountMember', data).then((resp) => {
			if (resp.status !== 'ok') {
			
			}
			
			// do some stuff
		})
	}
	
	const createAccountMember = (data: any) => {
		fetchNui('ei-banking:addAccountMember', data).then((resp) => {
			if (resp.status !== 'ok') {
				return enqueueSnackbar(resp.data.message, { variant: 'error' })
			}
			
			// do some stuff
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
