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
} from "@mui/material";

function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [expectedRate, setExpectedRate] = useState("");
  const [years, setYears] = useState("");

  const months = years ? years * 12 : 0;
  const i = expectedRate ? expectedRate / 12 / 100 : 0;
  const investedAmount = monthlyInvestment ? monthlyInvestment * months : 0;
  const totalValue =
    monthlyInvestment && expectedRate && years
      ? monthlyInvestment * (((Math.pow(1 + i, months) - 1) / i) * (1 + i))
      : 0;
  const estReturns = Math.max(0, totalValue - investedAmount);

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3.5, mt: 6, borderRadius: "16px" }}>
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
            onChange={(e) => setMonthlyInvestment(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Expected Return Rate (% p.a)"
            type="number"
            value={expectedRate}
            onChange={(e) => setExpectedRate(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Time Horizon (Years)"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            inputProps={{ min: 0 }}
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
              ₹{investedAmount ? investedAmount.toLocaleString("en-IN") : "0"}
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
  const [totalInvestment, setTotalInvestment] = useState("");
  const [expectedRate, setExpectedRate] = useState("");
  const [years, setYears] = useState("");

  const totalValue = totalInvestment && expectedRate && years
    ? totalInvestment * Math.pow(1 + expectedRate / 100, years)
    : 0;
  const estReturns = Math.max(0, totalValue - totalInvestment);

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3.5, mt: 6, borderRadius: "16px" }}>
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
            onChange={(e) => setTotalInvestment(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Expected Return Rate (% p.a)"
            type="number"
            value={expectedRate}
            onChange={(e) => setExpectedRate(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Time Horizon (Years)"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            inputProps={{ min: 0 }}
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
              ₹{totalInvestment ? Number(totalInvestment).toLocaleString("en-IN") : "0"}
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

function SwpCalculator() {
  const [totalInvestment, setTotalInvestment] = useState("");
  const [expectedRate, setExpectedRate] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [years, setYears] = useState("");

  const months = years ? years * 12 : 0;
  const r = expectedRate ? expectedRate / 12 / 100 : 0;

  // SWP Formula: FV = P * (1 + r)^n - W * [((1 + r)^n - 1) / r]
  const finalValue =
    totalInvestment && expectedRate && withdrawalAmount && years
      ? totalInvestment * Math.pow(1 + r, months) -
        withdrawalAmount * ((Math.pow(1 + r, months) - 1) / r)
      : 0;

  const totalWithdrawal = withdrawalAmount ? withdrawalAmount * months : 0;
  const remainingValue = Math.max(0, finalValue);

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3.5, mt: 6, borderRadius: "16px" }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        SWP (Systematic Withdrawal Plan) Calculator
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Calculate regular income from your investments while the balance continues to grow.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Total Investment (₹)"
            type="number"
            value={totalInvestment}
            onChange={(e) => setTotalInvestment(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Expected Return Rate (% p.a)"
            type="number"
            value={expectedRate}
            onChange={(e) => setExpectedRate(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Monthly Withdrawal (₹)"
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Time Horizon (Years)"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "action.hover" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Total Investment
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{totalInvestment ? Number(totalInvestment).toLocaleString("en-IN") : "0"}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "action.hover" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Total Withdrawal
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "success.main" }}>
              ₹{Math.round(totalWithdrawal).toLocaleString("en-IN")}
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
              Remaining Value
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{Math.round(remainingValue).toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureYears, setTenureYears] = useState("");

  const months = tenureYears ? tenureYears * 12 : 0;
  const r = interestRate ? interestRate / 12 / 100 : 0;
  const emi =
    loanAmount && interestRate && tenureYears
      ? (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
      : 0;
  const totalPayment = emi * months;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3.5, mt: 6, borderRadius: "16px" }}>
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
            onChange={(e) => setLoanAmount(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Annual Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Loan Tenure (Years)"
            type="number"
            value={tenureYears}
            onChange={(e) => setTenureYears(e.target.value)}
            inputProps={{ min: 0 }}
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
              ₹{loanAmount ? Number(loanAmount).toLocaleString("en-IN") : "0"}
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
      <Typography variant="h4" sx={{ fontWeight: 400, letterSpacing: "-0.5px", fontSize: "1.75rem" }}>
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
          <Tab label="SWP Calculator" />
          <Tab label="EMI Calculator" />
        </Tabs>
      </Box>

      {tabIndex === 0 && <SipCalculator />}
      {tabIndex === 1 && <LumpsumCalculator />}
      {tabIndex === 2 && <SwpCalculator />}
      {tabIndex === 3 && <EmiCalculator />}
    </Box>
  );
}