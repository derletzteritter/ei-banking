import React, { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import AccountsSearch from "./components/AccountsSearch";
import {
  useFilteredAccountsValue,
  useSetActiveAccount,
} from "./state/accounts.state";
import AccountsList from "./AccountsList";
import { useAccountsActions } from "./hooks/useAccountsActions";
import { Account } from "../../types/account";
import SidebarHeader from "./SidebarHeader";
import NewAccountButton from "./components/NewAccountButton";
import NewAccountModal from "./components/NewAccountModal";
import { useMemberAPI } from "../Members/hooks/useMemberAPI";

const Accounts: React.FC = () => {
  const accounts = useFilteredAccountsValue();
  const setActiveAccount = useSetActiveAccount();
  const [newAccountModal, setNewAccountModal] = useState<boolean>(false);
  const { getMembers } = useMemberAPI();

  const { getDefaultAccount } = useAccountsActions();

  useEffect(() => {
    const account = getDefaultAccount();
    setActiveAccount(account);
  }, [setActiveAccount, getDefaultAccount]);

  const handleChangeAccounts = useCallback(
    (account: Account) => {
      setActiveAccount(account);
      getMembers(account.id);
    },
    [setActiveAccount, getMembers]
  );

  const toggleAccountModal = () => {
    setNewAccountModal((prev) => !prev);
  };

  return (
    <Box>
      <React.Suspense fallback={<CircularProgress />}>
        <NewAccountModal open={newAccountModal} onClose={toggleAccountModal} />
        <SidebarHeader />
        <NewAccountButton onClick={toggleAccountModal} />
        <AccountsSearch />
        <React.Suspense fallback={<CircularProgress />}>
          <AccountsList
            accounts={accounts}
            handleChangeAccount={handleChangeAccounts}
          />
        </React.Suspense>
      </React.Suspense>
    </Box>
  );
};

export default Accounts;
