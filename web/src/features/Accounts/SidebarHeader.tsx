import React from "react";
import { Box, Button, CircularProgress, styled } from "@mui/material";
import { debugData } from "../../utils/debugData";
import { useCredentialsValue } from "../../state/player.state";
import { headerIcons } from "../../icons/svgProvider";
import { useVisibilityAPI } from "../../hooks/useVisibilityAPI";
import { useTranslation } from "react-i18next";

const Header = styled(Box)({
  marginTop: 20,
  paddingLeft: 10,
  marginBottom: 10,
  paddingRight: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

debugData([
  {
    action: "ei-banking:setCredentials",
    data: {
      charName: "Chip Chipperson",
    },
  },
]);

const SidebarHeader: React.FC = () => {
  const player = useCredentialsValue();
  const { exitNui } = useVisibilityAPI();
  const [t] = useTranslation();

  if (!player) {
    return <CircularProgress />;
  }

  return (
    <Header>
      <Button
        onClick={exitNui}
        variant="contained"
        size="small"
        endIcon={headerIcons.exit}
      >
        {t("LOGOUT")}
      </Button>
    </Header>
  );
};

export default SidebarHeader;
