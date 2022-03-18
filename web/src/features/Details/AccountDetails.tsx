import React from 'react';
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useActiveAccountValue } from "../Accounts/state/accounts.state";
import { AccountBalance, AccountName } from "./styles/Details.styles";
import { detailsIcons } from "../../icons/svgProvider";
import DepositModal from "./components/DepositModal";
import { useDepositModal, useWithdrawModal, useTransferModal } from "./state/modal.state";
import { useAccountsApi } from "../Accounts/hooks/useAccountsApi";
import WithdrawModal from "./components/WithdrawModal";
import { Account } from "../../types/account";

const AccountDetails: React.FC = () => {
	const activeAccount = useActiveAccountValue();
	const [depositModal, setDepositModal] = useDepositModal();
	const [withdrawModal, setWithdrawModal] = useWithdrawModal();
	const { depositMoney, withdrawMoney } = useAccountsApi()
  const [transferModal, setTransferModal] = useTransferModal();
	
	if (!activeAccount) {
		return <CircularProgress/>
	}
	
	const openDepositModal = () => {
		setDepositModal(true);
	}
	
	const closeDepositModal = () => {
		setDepositModal(false);
	}
	
	const openWithdrawModal = () => {
		setWithdrawModal(true);
	}
	
	const closeWithdrawModal = () => {
		setWithdrawModal(false);
	}

  const closeTransferModal = () => {
    setTransferModal(false);
  }

  const openTransferModal = () => {
    setTransferModal(true);
  }
	
	const handleDepositModal = (amount: string) => {
		depositMoney(activeAccount, amount);
		closeDepositModal();
	}
	
	const handleWithdrawModal = (amount: string) => {
		withdrawMoney(activeAccount, amount);
		closeWithdrawModal();
	}

  const handleTransferModal = (targetAccount: Account | number, amount: string) => {
    console.log(targetAccount)
    console.log(amount)
  }
	
	return (
		<Box ml={2}>
			<WithdrawModal open={withdrawModal} onClose={closeWithdrawModal} confirmWithdraw={handleWithdrawModal} />
			<DepositModal open={depositModal} onClose={closeDepositModal} confirmDeposit={handleDepositModal} />
			<Box mt={2}>
				<Stack direction="row" spacing={5}>
					<Box>
						<AccountName>{activeAccount.accountName}</AccountName>
						<AccountBalance>{activeAccount.balance}</AccountBalance>
					</Box>
					<Box>
						<Button endIcon={detailsIcons.cog} variant="contained">Settings</Button>
					</Box>
				</Stack>
				<Stack mt={3.4} direction="row" spacing={2}>
					<Button
						onClick={openDepositModal}
						style={{ backgroundColor: "#42464A" }}
						variant="contained"
						endIcon={detailsIcons.deposit}
					>
						Deposit
					</Button>
					<Button
						onClick={openWithdrawModal}
						style={{ backgroundColor: "#42464A" }}
						variant="contained"
						endIcon={detailsIcons.withdraw}
					>
						Withdraw
					</Button>
					<Button
            onClick={openTransferModal}
						style={{ backgroundColor: "#42464A" }}
						variant="contained"
						endIcon={detailsIcons.transfer}
					>
						Transfer
					</Button>
				</Stack>
			</Box>
		</Box>
	)
}

export default AccountDetails;
