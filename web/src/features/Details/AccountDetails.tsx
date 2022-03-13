import React from 'react';
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useActiveAccountValue } from "../Accounts/state/accounts.state";
import { AccountBalance, AccountName } from "./styles/Details.styles";
import { detailsIcons } from "../../icons/svgProvider";
import DepositModal from "./components/DepositModal";
import { useDepositModal } from "./state/modal.state";
import { useAccountsApi } from "../Accounts/hooks/useAccountsApi";

const AccountDetails: React.FC = () => {
	const activeAccount = useActiveAccountValue();
	const [depositModal, setDepositModal] = useDepositModal();
	const { depositMoney } = useAccountsApi()
	
	if (!activeAccount) {
		return <CircularProgress/>
	}
	
	const openDepositModal = () => {
		setDepositModal(true)
	}
	
	const closeDepositModal = () => {
		setDepositModal(false)
	}
	
	const handleDepositModal = (amount: string) => {
		depositMoney(activeAccount, amount)
		closeDepositModal()
	}
	
	return (
		<Box ml={2}>
			<DepositModal open={depositModal} onClose={closeDepositModal} confirmDeposit={handleDepositModal} />
			<Box mt={2}>
				<Stack direction="row" spacing={5}>
					<Box>
						<AccountName>{activeAccount.accountName}</AccountName>
						<AccountBalance>{activeAccount.balance}</AccountBalance>
					</Box>
					<Box>
						<Button endIcon={detailsIcons.cog} size="small" variant="contained">Settings</Button>
					</Box>
				</Stack>
				<Stack mt={3.4} direction="row" spacing={2}>
					<Button
						onClick={openDepositModal}
						style={{ backgroundColor: "#42464A" }}
						size="small"
						variant="contained"
						endIcon={detailsIcons.deposit}
					>
						Deposit
					</Button>
					<Button
						style={{ backgroundColor: "#42464A" }}
						size="small"
						variant="contained"
						endIcon={detailsIcons.withdraw}
					>
						Withdraw
					</Button>
					<Button
						style={{ backgroundColor: "#42464A" }}
						size="small"
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