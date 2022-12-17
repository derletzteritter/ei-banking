import React from 'react'
import { Box, Button } from "@mui/material";
import { headerIcons } from "../../../icons/svgProvider";
import { useTranslation } from 'react-i18next';

interface NewAccountButtonProps {
	onClick: () => void;
}

const NewAccountButton: React.FC<NewAccountButtonProps> = ({ onClick }) => {
	const [t] = useTranslation();

	return (
		<Box
			style={{
				marginLeft: 10,
			}}
		>
			<Button
				onClick={onClick}
				endIcon={headerIcons.plus}
				style={{ backgroundColor: "#42464A" }}
				size="small"
				variant="contained"
			>
				{t("NEW_ACCOUNT")}
			</Button>
		</Box>
	)
}

export default NewAccountButton;