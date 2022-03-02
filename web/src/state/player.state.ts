import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { CredentialsProps } from "../types/player";

export const playerState = {
	player: atom<CredentialsProps | null>({
		key: 'playerStatePlayer',
		default: null
	})
}

export const useCredentialsValue = () => useRecoilValue(playerState.player);
export const useSetCredentials = () => useSetRecoilState(playerState.player);