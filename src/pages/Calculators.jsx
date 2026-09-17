import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Grid,
  Divider,
  Stack,
  Card,
  CardContent,
} from "@mui/material";

function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedRate, setExpectedRate] = useState(12);
  const [years, setYears] = useState(10);

  const months = years * 12;
  const i = expectedRate / 12 / 100;
  const investedAmount = monthlyInvestment * months;
  const totalValue =
    monthlyInvestment * (((Math.pow(1 + i, months) - 1) / i) * (1 + i));
  const estReturns = Math.max(0, totalValue - investedAmount);

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3.5, mt: 3, borderRadius: "16px" }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        SIP (Systematic Investment Plan) Calculator
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Calculate expected wealth creation through regular monthly disciplined investments.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Monthly Investment (₹)"
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 0)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Expected Return Rate (% p.a)"
            type="number"
            value={expectedRate}
            onChange={(e) => setExpectedRate(Number(e.target.value) || 0)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Time Horizon (Years)"
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value) || 0)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "action.hover" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Invested Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{investedAmount.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "action.hover" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Estimated Wealth Gain
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "success.main" }}>
              ₹{Math.round(estReturns).toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              color: "#ffffff",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 700 }}>
              Total Maturity Value
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{Math.round(totalValue).toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

function LumpsumCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(100000);
  const [expectedRate, setExpectedRate] = useState(12);
  const [years, setYears] = useState(5);

  const totalValue = totalInvestment * Math.pow(1 + expectedRate / 100, years);
  const estReturns = Math.max(0, totalValue - totalInvestment);

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3.5, mt: 3, borderRadius: "16px" }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        Lumpsum Investment Calculator
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Calculate the future compounded value of a one-time lump-sum investment.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Total Investment Amount (₹)"
            type="number"
            value={totalInvestment}
            onChange={(e) => setTotalInvestment(Number(e.target.value) || 0)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Expected Return Rate (% p.a)"
            type="number"
            value={expectedRate}
            onChange={(e) => setExpectedRate(Number(e.target.value) || 0)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Time Horizon (Years)"
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value) || 0)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "action.hover" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Invested Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{totalInvestment.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "action.hover" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Estimated Returns
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "success.main" }}>
              ₹{Math.round(estReturns).toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              color: "#ffffff",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 700 }}>
              Total Maturity Value
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{Math.round(totalValue).toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(10);

  const months = tenureYears * 12;
  const r = interestRate / 12 / 100;
  const emi =
    (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3.5, mt: 3, borderRadius: "16px" }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        Loan EMI Calculator
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Estimate monthly loan payments and total interest payable.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Loan Amount (₹)"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Annual Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Loan Tenure (Years)"
            type="number"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value) || 0)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              color: "#ffffff",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 700 }}>
              Monthly EMI
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{Math.round(emi).toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "action.hover" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Principal Loan
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{loanAmount.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "action.hover" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Total Interest Payable
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "error.main" }}>
              ₹{Math.round(totalInterest).toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default function Calculators() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
        Financial Wealth Calculators
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 3 }}>
        Plan your financial milestones with precision math and compound growth models.
      </Typography>

      {/* Tabs Header */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
            },
          }}
        >
          <Tab label="SIP Calculator" />
          <Tab label="Lumpsum Calculator" />
          <Tab label="EMI Calculator" />
        </Tabs>
      </Box>

      {tabIndex === 0 && <SipCalculator />}
      {tabIndex === 1 && <LumpsumCalculator />}
      {tabIndex === 2 && <EmiCalculator />}
    </Box>
  );
}