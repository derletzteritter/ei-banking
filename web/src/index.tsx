import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import { SnackbarProvider } from "notistack";

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<ThemeProvider theme={theme}>
				<SnackbarProvider
					autoHideDuration={4000}
					anchorOrigin={{
						horizontal: "left",
						vertical: "bottom"
					}}
				>
					<App/>
				</SnackbarProvider>
			</ThemeProvider>
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById('root')
);
