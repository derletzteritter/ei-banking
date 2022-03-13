import React from 'react'
import { Box, Button } from "@mui/material";
import { headerIcons } from "../../../icons/svgProvider";

interface NewAccountButtonProps {
	onClick: () => void;
}

const NewAccountButton: React.FC<NewAccountButtonProps> = ({ onClick }) => {
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
				New account
			</Button>
		</Box>
	)
}

export default NewAccountButton;