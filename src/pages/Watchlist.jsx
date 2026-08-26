import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Link,
} from "@mui/material";

// Sample Stock Watchlist Data matching the image
const watchlistData = [
  { id: 1, name: "SBI Cards", cmp: 649.0, marCap: 61761.6, fairVal: 758.03, pe: 27.15, cmpBv: 3.93, divYld: 0.39, npQtr: 664.44, opm: 26.78, rsi: 53.36, roce: 10.1, sales: 20063.29, roe: 14.69, debt: 44063.73, cwip: 12.11, peg: -19.82 },
  { id: 2, name: "HDFC Bank", cmp: 726.95, marCap: 1120311.43, fairVal: 709.0, pe: 14.18, cmpBv: 1.86, divYld: 1.79, npQtr: 20382.69, opm: 42.69, rsi: 37.75, roce: 7.02, sales: 351818.61, roe: 13.64, debt: 3733201.93, cwip: 0.0, peg: 0.79 },
  { id: 3, name: "Trent", cmp: 2924.0, marCap: 155917.12, fairVal: 3318.71, pe: 85.27, cmpBv: 22.32, divYld: 0.14, npQtr: 518.07, opm: 18.75, rsi: 42.52, roce: 28.34, sales: 20945.44, roe: 27.74, debt: 2561.25, cwip: 253.99, peg: 1.21 },
  { id: 4, name: "Havells India", cmp: 1268.0, marCap: 79574.82, fairVal: 884.33, pe: 47.75, cmpBv: 8.41, divYld: 0.79, npQtr: 289.71, opm: 9.11, rsi: 53.27, roce: 24.9, sales: 23590.61, roe: 19.03, debt: 265.2, cwip: 442.53, peg: 2.91 },
  { id: 5, name: "Jubilant Food.", cmp: 506.75, marCap: 33437.66, fairVal: 515.97, pe: 87.75, cmpBv: 14.59, divYld: 0.24, npQtr: 100.03, opm: 19.81, rsi: 66.53, roce: 14.8, sales: 9838.46, roe: 20.96, debt: 4902.22, cwip: 160.2, peg: 10.34 },
  { id: 6, name: "Jio Financial", cmp: 244.0, marCap: 161116.66, fairVal: 392.97, pe: 77.97, cmpBv: 1.16, divYld: 0.25, npQtr: 830.25, opm: 66.16, rsi: 45.21, roce: 1.86, sales: 4905.27, roe: 1.19, debt: 21768.36, cwip: 104.87, peg: 0.27 },
  { id: 7, name: "Parag Milk Foods", cmp: 225.5, marCap: 2832.5, fairVal: 148.05, pe: 21.03, cmpBv: 2.24, divYld: 0.44, npQtr: 22.05, opm: 6.83, rsi: 55.84, roce: 13.52, sales: 3910.55, roe: 12.28, debt: 607.4, cwip: 37.35, peg: 0.55 },
  { id: 8, name: "ACC", cmp: 1307.4, marCap: 24551.31, fairVal: 404.65, pe: 12.92, cmpBv: 1.19, divYld: 0.57, npQtr: 147.0, opm: 10.33, rsi: 39.95, roce: 11.25, sales: 25441.73, roe: 10.86, debt: 428.61, cwip: 2227.3, peg: 0.41 },
];

export default function Watchlist() {
  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      {/* Top Header Buttons */}
      <Stack
        direction="row"
        spacing={1.5}
        justifyContent="flex-end"
        sx={{ mb: 2 }}
      >
        <Button variant="outlined" size="small" sx={{ textTransform: "uppercase" }}>
          📊 Industry
        </Button>
        <Button variant="outlined" size="small" sx={{ textTransform: "uppercase" }}>
          📥 Export
        </Button>
        <Button variant="contained" size="small" sx={{ textTransform: "uppercase" }}>
          ⚙️ Edit Columns
        </Button>
      </Stack>

      {/* Watchlist Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small" sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>S.No. ↑</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>CMP <Typography component="span" variant="caption" color="text.secondary">Rs.</Typography></TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Mar Cap <Typography component="span" variant="caption" color="text.secondary">Rs.Cr.</Typography></TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Fair Value</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>P/E</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>CMP / BV</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Div Yld %</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>NP Qtr <Typography component="span" variant="caption" color="text.secondary">Rs.Cr.</Typography></TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>OPM %</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>RSI</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>ROCE %</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Sales <Typography component="span" variant="caption" color="text.secondary">Rs.Cr.</Typography></TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>ROE %</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Debt <Typography component="span" variant="caption" color="text.secondary">Rs.Cr.</Typography></TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>CWIP <Typography component="span" variant="caption" color="text.secondary">Rs.Cr.</Typography></TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>PEG</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {watchlistData.map((row) => (
              <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>{row.id}.</TableCell>
                <TableCell component="th" scope="row">
                  <Link href="#" underline="hover" sx={{ fontWeight: "medium", color: "primary.main" }}>
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>{row.cmp.toFixed(2)}</TableCell>
                <TableCell align="right">{row.marCap.toFixed(2)}</TableCell>
                <TableCell align="right">{row.fairVal.toFixed(2)}</TableCell>
                <TableCell align="right">{row.pe.toFixed(2)}</TableCell>
                <TableCell align="right">{row.cmpBv.toFixed(2)}</TableCell>
                <TableCell align="right">{row.divYld.toFixed(2)}</TableCell>
                <TableCell align="right">{row.npQtr.toFixed(2)}</TableCell>
                <TableCell align="right">{row.opm.toFixed(2)}</TableCell>
                <TableCell align="right">{row.rsi.toFixed(2)}</TableCell>
                <TableCell align="right">{row.roce.toFixed(2)}</TableCell>
                <TableCell align="right">{row.sales.toFixed(2)}</TableCell>
                <TableCell align="right">{row.roe.toFixed(2)}</TableCell>
                <TableCell align="right">{row.debt.toFixed(2)}</TableCell>
                <TableCell align="right">{row.cwip.toFixed(2)}</TableCell>
                <TableCell align="right">{row.peg.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}