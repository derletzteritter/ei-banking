import { fetchNui } from "../utils/fetchNui";

export const useVisibilityAPI = () => {
	const exitNui = async () => {
		await fetchNui('hideFrame')
	}
	
	return { exitNui }
}