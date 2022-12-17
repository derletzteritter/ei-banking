import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Typography,
} from "@mui/material";
import { useActiveAccountValue } from "../Accounts/state/accounts.state";
import { fetchNui } from "../../utils/fetchNui";
import { useTranslation } from "react-i18next";

type TransactionProp = {
  id: number;
  fromAccount: number;
  toAccount: number;
  type: 'deposit';
  amount: number;
  createdAt: string;
}

export const TransactionTable = () => {
  const activeAccount = useActiveAccountValue();
  const [transactions, setTransactions] = useState<TransactionProp[]>(null);
  const [t] = useTranslation();

  useEffect(() => {
    if (activeAccount) {
      fetchNui('ei-banking:getTransactions', activeAccount.id).then((res) => {
        if (res.status !== 'ok') {
          console.error("Failed to get transactions");
          return;
        }
  
        setTransactions(res.data);
      })
    }
  }, [activeAccount]);

  return (
    <Box ml={2} mt={2} mr={2}>
      <Typography variant="h5" color="white" fontWeight={500}>
        {t("TRANSACTIONS")}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ background: "rgb(66, 70, 74)", marginTop: 1 }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t("TRANSACTION_AMOUNT")}</TableCell>
              <TableCell align="left">{t("TRANSACTION_TYPE")}</TableCell>
              <TableCell align="left">{t("TRANSACTION_TO")}</TableCell>
              <TableCell align="left">{t("TRANSACTION_FROM")}</TableCell>
            </TableRow>
          </TableHead>

          {transactions ? (
            <TableBody>
              {transactions.length > 0 &&
                transactions.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.amount}
                    </TableCell>
                    <TableCell align="left">{row.type}</TableCell>
                    <TableCell align="left">{row.toAccount}</TableCell>
                    <TableCell align="left">{row.fromAccount}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          ) : (
            <p style={{ paddingLeft: 15 }}>{t("NO_TRANSACTIONS")}</p>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};
