import React from "react";
import { Account } from "../../../types/account";
import { Box, styled, IconButton } from "@mui/material";
import { useActiveAccountValue } from "../state/accounts.state";
import { detailsIcons } from "../../../icons/svgProvider";
import { useSetSettingsModal } from "../../Details/state/modal.state";
import { useTranslation } from "react-i18next";

const ItemWrapper = styled(Box)<{ selected: boolean }>(({ selected }) => ({
  background: "#42464A",
  color: "#fff",
  height: "60px",
  boxSizing: "border-box",
  borderRadius: 7,
  border: selected ? "2px solid gray" : "2px solid #42464A",
  paddingLeft: 10,
  paddingTop: 5,
  display: "flex",
  flexDirection: "column",
}));

const PrimaryText = styled("p")({
  fontWeight: 500,
  margin: 0,
  color: "#fff",
  whiteSpace: "nowrap",
  width: "200px",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const TypeText = styled("p")({
  fontWeight: "normal",
  margin: 0,
  color: "#B5B5B5",
  fontSize: 14,
  paddingRight: 5,
});

const SecondaryText = styled("p")({
  fontWeight: "normal",
  margin: 0,
  marginTop: 4,
  color: "#B5B5B5",
  fontSize: 14,
});

interface AccountItemProps {
  account: Account;
  handleChangeAccount: (account: Account) => void;
}

const AccountItem: React.FC<AccountItemProps> = ({
  account,
  handleChangeAccount,
}) => {
  const activeAccount = useActiveAccountValue();
  const setSettingsModal = useSetSettingsModal();
  const [t] = useTranslation();

  return (
    <ItemWrapper
      onClick={() => handleChangeAccount(account)}
      selected={activeAccount?.id === account?.id}
    >
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: 0,
        }}
      >
        <PrimaryText>{account.accountName}</PrimaryText>
        <TypeText>{account.type === "personal" ? t("PERSONAL_ACCOUNT_TYPE") : t("SHARED_ACCOUNT_TYPE")}</TypeText>
      </Box>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: 0,
        }}
      >
        <SecondaryText>{account.balance}</SecondaryText>
        {account.type === "personal" && (
          <IconButton
            onClick={() => setSettingsModal(true)}
            style={{ color: "#ddd" }}
          >
            {detailsIcons.cog}
          </IconButton>
        )}
      </Box>
    </ItemWrapper>
  );
};

export default AccountItem;
