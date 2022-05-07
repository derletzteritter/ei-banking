import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";

interface MemberProps {
  member: any;
}

const Member: React.FC<MemberProps> = ({ member }) => {
    const [canDeposit, setCanDeposit] = useState(member.canDeposit);
    const [canWithdraw, setCanWithdraw] = useState(member.canWithdraw);
    const [canTransfer, setCanTransfer] = useState(member.canTransfer);

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
          <Button size="small" variant="outlined">
            Update
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
          <FormControlLabel control={<Checkbox checked={canDeposit} />} label="Deposit" />
          <FormControlLabel control={<Checkbox checked={canWithdraw} />} label="Withdraw" />
          <FormControlLabel control={<Checkbox checked={canTransfer} />} label="Transfer" />
        </FormGroup>
      </Box>
    </Box>
  );
};

export default Member;
