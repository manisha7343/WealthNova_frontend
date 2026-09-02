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

// Placeholder Card for Calculator Details
function CalculatorBox({ title }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Investment / Loan Amount (₹)"
            type="number"
            defaultValue={10000}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Expected Return Rate (% p.a)"
            type="number"
            defaultValue={12}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Time Period (Years)"
            type="number"
            defaultValue={5}
          />
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ bgcolor: "action.hover", p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
          Estimated Output Value: <strong>₹1,24,857</strong>
        </Typography>
      </Box>
    </Paper>
  );
}

export default function Calculators() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // return (<>
  //     <iframe src="https://dream-calc.netlify.app" style={{border:0, borderRadius:10, width:"100%", height:"100%", minHeight:"500px"}} ></iframe>
  // </>)
  
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Financial Calculators
      </Typography>

      {/* Tabs Header */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="SIP Calculator" />
          <Tab label="Lumpsum Calculator" />
          <Tab label="EMI Calculator" />
          <Tab label="SWP Calculator" />
        </Tabs>
      </Box>

      {/* Dynamic Tab Content */}
      {tabIndex === 0 && <CalculatorBox title="SIP (Systematic Investment Plan) Calculator" />}
      {tabIndex === 1 && <CalculatorBox title="Lumpsum Investment Calculator" />}
      {tabIndex === 2 && <CalculatorBox title="Equated Monthly Installment (EMI) Calculator" />}
      {tabIndex === 3 && <CalculatorBox title="SWP (Systematic Withdrawal Plan) Calculator" />}
    </Box>
  );
}