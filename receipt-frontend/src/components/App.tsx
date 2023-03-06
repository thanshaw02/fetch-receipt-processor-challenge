import { FC } from 'react';
import { Box, Paper, TextField, Typography } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
import { Controller, useForm } from 'react-hook-form';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { formOptionRules } from "../model/formOptionRules"

const App: FC<unknown> = () => {
  const { control, handleSubmit, register } = useForm();

  const submitForm = () => {

  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitForm)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: { md: 18 },
      }}
    >
      <Paper elevation={9} sx={{ p: 3 }}>
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

        {/* retailer name field */}
        <Controller
          name="retailer"
          control={control}
          defaultValue=""
          rules={formOptionRules.retailer}
          render={({ field }) => (
            <TextField
              sx={{ mt: 3 }}
              fullWidth
              size="medium"
              variant="outlined"
              label="Retailer Name"
              {...field}
              {...register("retailer")}
            />
          )}
        />

        {/* purchase date field */}
        <Controller 
          name="purchase-date"
          control={control}
          defaultValue=""
          rules={formOptionRules.purchaseDate}
          render={({ field }) => (
            <TextField
              sx={{ mt: 3 }}
              fullWidth
              size="medium"
              variant="outlined"
              label="Purchase Date"
              {...field}
              {...register("purchase-date")}
            />
          )}
        />

        {/* purchase time field */}
        <Controller 
          name="purchase-time"
          control={control}
          defaultValue=""
          rules={formOptionRules.purchaseDate}
          render={({ field }) => (
            <TextField
              sx={{ mt: 3 }}
              fullWidth
              size="medium"
              variant="outlined"
              label="Purchase Time"
              {...field}
              {...register("purchase-time")}
            />
          )}
        />

        {/* items purchased field */}


        {/* total amount field */}
        <Controller 
          name="total"
          control={control}
          defaultValue=""
          rules={formOptionRules.purchaseDate}
          render={({ field }) => (
            <TextField
              sx={{ mt: 3 }}
              fullWidth
              size="medium"
              variant="outlined"
              label="Total Amount"
              {...field}
              {...register("total")}
            />
          )}
        />
      </Paper>
    </Box>
  );
};

export default App;
