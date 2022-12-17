import React from "react";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useActiveAccountValue } from "../Accounts/state/accounts.state";
import { detailsIcons } from "../../icons/svgProvider";
import DepositModal from "./components/DepositModal";
import {
  useDepositModal,
  useWithdrawModal,
  useTransferModal,
  useSettingsModal,
} from "./state/modal.state";
import { useAccountsApi } from "../Accounts/hooks/useAccountsApi";
import WithdrawModal from "./components/WithdrawModal";
import { Account } from "../../types/account";
import TransferModal from "./components/TransferModal";
import SettingsModal from "./components/Settings/SettingsModal";
import { useTranslation } from "react-i18next";

const AccountDetails: React.FC = () => {
  const activeAccount = useActiveAccountValue();
  const [depositModal, setDepositModal] = useDepositModal();
  const [withdrawModal, setWithdrawModal] = useWithdrawModal();
  const { depositMoney, withdrawMoney, transferMoney } = useAccountsApi();
  const [transferModal, setTransferModal] = useTransferModal();
  const [settingsModal, setSettingsModal] = useSettingsModal();
  const [t] = useTranslation()

  if (!activeAccount) {
    return <CircularProgress />;
  }

  const openDepositModal = () => {
    setDepositModal(true);
  };

  const closeDepositModal = () => {
    setDepositModal(false);
  };

  const openWithdrawModal = () => {
    setWithdrawModal(true);
  };

  const closeWithdrawModal = () => {
    setWithdrawModal(false);
  };

  const closeTransferModal = () => {
    setTransferModal(false);
  };

  const openTransferModal = () => {
    setTransferModal(true);
  };

  const closeSettingsModal = () => {
    setSettingsModal(false);
  };

  const openSettingsModal = () => {
    setSettingsModal(true);
  };

  const handleDepositModal = (amount: string) => {
    depositMoney(activeAccount, amount);
    closeDepositModal();
  };

  const handleWithdrawModal = (amount: string) => {
    withdrawMoney(activeAccount, amount);
    closeWithdrawModal();
  };

  const handleTransferModal = (
    targetAccount: Account | string,
    amount: string
  ) => {
    transferMoney(activeAccount, targetAccount, amount);
    closeTransferModal();
  };

  return (
    <Box ml={2}>
      <WithdrawModal
        open={withdrawModal}
        onClose={closeWithdrawModal}
        confirmWithdraw={handleWithdrawModal}
      />
      <DepositModal
        open={depositModal}
        onClose={closeDepositModal}
        confirmDeposit={handleDepositModal}
      />
      <TransferModal
        open={transferModal}
        onClose={closeTransferModal}
        confirmTransfer={handleTransferModal}
      />
      <SettingsModal open={settingsModal} onClose={closeSettingsModal} />
      <Box>
        <Stack mt={2.5} direction="row" spacing={2}>
          <Button
            onClick={openDepositModal}
            style={{ backgroundColor: "#42464A" }}
            variant="contained"
            endIcon={detailsIcons.deposit}
          >
            {t("DEPOSIT_MODAL_TITLE")}
          </Button>
          <Button
            onClick={openWithdrawModal}
            style={{ backgroundColor: "#42464A" }}
            variant="contained"
            endIcon={detailsIcons.withdraw}
          >
            {t("WITHDRAW_MODAL_TITLE")}
          </Button>
          <Button
            onClick={openTransferModal}
            style={{ backgroundColor: "#42464A" }}
            variant="contained"
            endIcon={detailsIcons.transfer}
          >
            {t("TRANSFER_MODEL_TITLE")}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AccountDetails;
