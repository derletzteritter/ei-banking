import React from 'react';
import './App.css'
import { debugData } from "./utils/debugData";
import { BankWrapper } from "./components/BankWrapper";
import { BankContainer } from "./components/BankContainer";
import { CircularProgress, Grid } from "@mui/material";
import Accounts from "./features/Accounts/Accounts";
import { usePlayerService } from "./hooks/usePlayerService";
import AccountDetails from "./features/Details/AccountDetails";


debugData([
	{
		action: 'setVisible',
		data: true,
	}
])

const App: React.FC = () => {
	usePlayerService();
	
	return (
		<BankWrapper>
			<BankContainer>
				<Grid container>
					<Grid item sm={5} md={4} lg={3}>
						<React.Suspense fallback={<CircularProgress />}>
							<Accounts/>
						</React.Suspense>
					</Grid>
					<Grid item sm={7} md={8} lg={9}>
						<AccountDetails />
					</Grid>
				</Grid>
			</BankContainer>
		</BankWrapper>
	);
}

export default App;
