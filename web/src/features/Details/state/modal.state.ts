import { atom, useRecoilState, useSetRecoilState } from "recoil";

export const depositModal = atom<boolean>({
	key: 'detailsDepositModal',
	default: false
})

export const useDepositModal = () => useRecoilState(depositModal)
export const useSetDepositModal = () => useSetRecoilState(depositModal)