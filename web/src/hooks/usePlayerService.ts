import { useSetCredentials } from "../state/player.state";
import { useNuiEvent } from "./useNuiEvent";

export const usePlayerService = () => {
	const setCredentials = useSetCredentials();
	
	useNuiEvent('ei-banking:setCredentials', setCredentials);
}