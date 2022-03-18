import { atom, useRecoilState, useSetRecoilState } from "recoil";

export const depositModal = atom<boolean>({
	key: 'detailsDepositModal',
	default: false
})

export const withdrawModal = atom<boolean>({
	key: 'detailsWithdrawModal',
	default: false
})

export const transferModal = atom<boolean>({
	key: 'detailsTransferModal',
	default: false
})

export const useDepositModal = () => useRecoilState(depositModal)
export const useSetDepositModal = () => useSetRecoilState(depositModal)

export const useWithdrawModal = () => useRecoilState(withdrawModal)
export const useSetWithdrawModal = () => useSetRecoilState(withdrawModal)

export const useTransferModal = () => useRecoilState(transferModal)
export const useSetTransferModal = () => useSetRecoilState(transferModal)
