import { FC, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddPurchasedItemComponent from "./AddPurchasedItemComponent";
import Receipt, { ReceiptItem } from "../model/receipt";
import FetchRewards from "../api/fetchRewards";

const App: FC<unknown> = () => {
  const [error, setError] = useState<string>("");

  const [receiptItems, setReceiptItems] = useState<
    Array<ReceiptItem>
  >([]);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);

    console.log(`Receipt items:\n${JSON.stringify(receiptItems)}`);

    const retailerName = formData.get("retailer-name");
    if (!retailerName) {
      setError("Please enter a retailer name");
      return;
    }

    const purchaseDate = formData.get("purchase-date");
    if (!purchaseDate) {
      setError("Please enter a purchase date");
      return;
    }

    const purchaseTime = formData.get("purchase-time");
    if (!purchaseTime) {
      setError("Please enter a purchase time");
      return;
    }

    if (!receiptItems.length) {
      setError("You must have at least one item for the receipt");
      return;
    }

    const total = formData.get("total-amount");
    if (!total) {
      // possibly just calculate this myself??
      setError("Please enter the total amount for all items");
      return;
    }

    const newReceipt: Receipt = {
      retailer: retailerName.toString(),
      purchaseDate: purchaseDate.toString(),
      purchaseTime: purchaseTime.toString(),
      items: receiptItems,
      total: total.toString(),
    };

    // console.log(`Receipt object:\n${JSON.stringify(newReceipt)}`);
    FetchRewards.processReceipt(newReceipt).then(
      (receiptId) => {
        console.log(
          `Receipt processed successfully -- id: ${receiptId.id}`
        );
      },
      (err) => {
        console.error(err);
        setError("Error process receipt");
        // loading stuff
      }
    );
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

          {/* error snackbar */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

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
          <AddPurchasedItemComponent
            onChange={(receiptItems) => setReceiptItems(receiptItems)}
          />

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

          {/* submit button */}
          <Grid item xs={12}>
            <Button
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
              variant="contained"
            >
              Submit Receipt
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default App;
