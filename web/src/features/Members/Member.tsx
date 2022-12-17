import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useActiveAccountValue } from "../Accounts/state/accounts.state";
import { useTranslation } from "react-i18next";

interface MemberProps {
  member: any;
  updateMember: (data: any) => void;
  deleteMember: (data: any) => void;
}

const Member: React.FC<MemberProps> = ({ member, updateMember, deleteMember }) => {
    const [canDeposit, setCanDeposit] = useState(member.canDeposit);
    const [canWithdraw, setCanWithdraw] = useState(member.canWithdraw);
    const [canTransfer, setCanTransfer] = useState(member.canTransfer);
    const account = useActiveAccountValue()

    const [t] = useTranslation();

    const handleUpdate = () => {
        const data = { canDeposit, canWithdraw, canTransfer, memberId: member.citizenId, accountId: account.id }
        updateMember(data)
    }

    const handleDelete = () => { 
      deleteMember({ memberId: member.citizenId })
    }

  return (
    <Box
      mb={2}
      display="flex"
      gap={10}
      justifyContent="flex-start"
      alignItems="start"
    >
      <Box>
        <Typography>{member.name}</Typography>
        <Typography fontSize={14} color="gray">
          {member.citizenId}
        </Typography>
        <Box mt={1}>
          <Button onClick={handleUpdate} size="small" variant="outlined">
            {t("UPDATE")}
          </Button>
          <Button onClick={handleDelete} size="small" variant="outlined">
            {t("DELETE")}
          </Button>
        </Box>
      </Box>
      <Box>
        <FormGroup
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <FormControlLabel control={<Checkbox onChange={(e) => setCanDeposit(e.target.checked)} checked={canDeposit} />} label={t("MEMBER_UPDATE_DEPOSIT")} />
          <FormControlLabel control={<Checkbox onChange={(e) => setCanWithdraw(e.target.checked)} checked={canWithdraw} />} label={t("MEMBER_UPDATE_WITHDRAW")}/>
          <FormControlLabel control={<Checkbox onChange={(e) => setCanTransfer(e.target.checked)} checked={canTransfer} />} label={t("MEMBER_UPDATE_TRANSFER")} />
        </FormGroup>
      </Box>
    </Box>
  );
};

export default React.memo(Member);
