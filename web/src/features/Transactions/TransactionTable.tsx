import React from "react";
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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number
) {
  return { name, calories, fat, carbs };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24),
  createData("Ice cream sandwich", 237, 9.0, 37),
  createData("Eclair", 262, 16.0, 24),
  createData("Cupcake", 305, 3.7, 67),
  createData("Gingerbread", 356, 16.0, 49),
];

export const TransactionTable = () => {
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
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
