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
import { useAccountsValue, useActiveAccountValue } from "../Accounts/state/accounts.state";
import { fetchNui } from "../../utils/fetchNui";
import { useTranslation } from "react-i18next";
import dayjs from 'dayjs';

enum TransactionType {
  deposit = "Deposit",
  withdraw = "Withdraw",
  transfer = "Transfer"
}

type TransactionProp = {
  id: number;
  fromAccount: number;
  toAccount: number;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  createdAt: string;
}

export const TransactionTable = () => {
  const activeAccount = useActiveAccountValue();
  const accounts = useAccountsValue();
  const [transactions, setTransactions] = useState<TransactionProp[]>(null);
  const [t] = useTranslation();



  useEffect(() => {
    if (activeAccount && accounts) {
      fetchNui('ei-banking:getTransactions', activeAccount.id).then((res) => {
        if (res.status !== 'ok') {
          console.error("Failed to get transactions");
          return;
        }
  
        setTransactions(res.data);
      })
    }
  }, [activeAccount]);


  if (!accounts && !activeAccount) return null;

  const findAccount = (accountId: number) => {
    if (accounts) {
    const account = accounts?.find((acc) => acc.id == accountId);

    if (!account) {
      return account;
    }

    return account.accountName;
    }

    return accountId;
  }

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
              <TableCell align="left">{t("TRANSACTION_DATE")}</TableCell>
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
                    <TableCell align="left">{TransactionType[row.type]}</TableCell>
                    <TableCell align="left">{findAccount(row.toAccount)}</TableCell>
                    <TableCell align="left">{findAccount(row.fromAccount)}</TableCell>
                    <TableCell align="left">{dayjs(row.createdAt).format(t("DATE_FORMAT"))}</TableCell>
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
