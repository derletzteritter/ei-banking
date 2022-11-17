import React, { useState } from "react";
import "./App.css";
import { debugData } from "./utils/debugData";
import { BankWrapper } from "./components/BankWrapper";
import { BankContainer } from "./components/BankContainer";
import { CircularProgress, Grid, Box } from "@mui/material";
import Accounts from "./features/Accounts/Accounts";
import { usePlayerService } from "./hooks/usePlayerService";
import AccountDetails from "./features/Details/AccountDetails";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { useAccountListener } from "./features/Accounts/hooks/useAccountListener";
import { useNotificationService } from "./notifications/useNotificationService";
import { TransactionTable } from "./features/Transactions/TransactionTable";

debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {
  const [visible, setVisible] = useState(false);

  usePlayerService();
  useAccountListener();
  useNotificationService();

  useNuiEvent("setVisible", (show) => {
    setVisible(show);
  });

  return (
    <>
      {visible && (
        <BankWrapper>
          <BankContainer>
            <Grid container>
              <Grid item sm={5} md={4} lg={3}>
                <React.Suspense fallback={<CircularProgress />}>
                  <Accounts />
                </React.Suspense>
              </Grid>
              <Grid item sm={7} md={8} lg={9}>
                <React.Suspense fallback={<CircularProgress />}>
                  <AccountDetails />
                </React.Suspense>
                <TransactionTable />
              </Grid>
            </Grid>
          </BankContainer>
        </BankWrapper>
      )}
    </>
  );
};

export default App;
