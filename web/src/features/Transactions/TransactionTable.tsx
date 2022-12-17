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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number
) {
  return { name, calories, fat, carbs };
}

export const TransactionTable = () => {
  const activeAccount = useActiveAccountValue();
  const [transactions, setTransactions] = useState(null);

  return (
    <Box ml={2} mt={2} mr={2}>
      <Typography variant="h5" color="white" fontWeight={500}>
        Transactions
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ background: "rgb(66, 70, 74)", marginTop: 1 }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell align="right">To</TableCell>
              <TableCell align="right">From</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>

          {transactions ? (
            <TableBody>
              {transactions &&
                transactions.map((row: any) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.accountName}
                    </TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          ) : (
            <p style={{ paddingLeft: 15 }}>No transactions yet</p>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};
