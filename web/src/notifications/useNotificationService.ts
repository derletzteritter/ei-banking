import { useNuiEvent } from "../hooks/useNuiEvent";
import { SnackbarMessage, useSnackbar, VariantType } from "notistack";

interface SetNotificationProps {
	message: SnackbarMessage;
	type: VariantType;
}

export const useNotificationService = () => {
	const { enqueueSnackbar } = useSnackbar();
	
	useNuiEvent('ei-banking:setNotification', (data: SetNotificationProps) => {
		enqueueSnackbar(data.message, { variant: data.type })
	})
}