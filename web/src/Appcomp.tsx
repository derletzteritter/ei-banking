import React from 'react';
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import { SnackbarProvider } from "notistack";
import './i18next';
import App from './App';

export default function AppComponent() {
  return (
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
  )
}