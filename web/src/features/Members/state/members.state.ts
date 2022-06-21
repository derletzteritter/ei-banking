import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export const membersState = {
	members: atom<any[]>({
		key: 'membersStateMembers',
		default: null,
	})
}

export const useMembersValue = () => useRecoilValue(membersState.members);
export const useMembers = () => useRecoilState(membersState.members);
export const useSetMembersState = () => useSetRecoilState(membersState.members);
