import { FC } from 'react';
import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { formOptionRules } from "../model/formOptionRules"
import AddPurchasedItemComponent from './AddPurchasedItemComponent';

const App: FC<unknown> = () => {

  const submitForm = () => {

  };

  return (
    <Box
      component="form"
      onSubmit={submitForm}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: { md: 18 },
      }}
    >
      <Paper elevation={9} sx={{ p: 3 }}>
        <Grid>
          <Grid item xs={12}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              Record Receipt Points
            </Typography>
          </Grid>

          {/* retailer name field */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              label="Retailer Name"
              name="retailer-name"
            />
          </Grid>

          {/* purchase date field */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              label="Purchase Date"
              name="purchase-date"
            />
          </Grid>

          {/* purchase time field */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              label="Purchase Time"
              name="purchase-time"
            />
          </Grid>

          {/* items purchased field */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <AddPurchasedItemComponent />
          </Grid>

          {/* total amount field */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              label="Total Amount"
              name="total-amount"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default App;
