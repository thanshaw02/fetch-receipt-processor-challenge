import { FC, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddPurchasedItemComponent from "./AddPurchasedItemComponent";
import Receipt, { ReceiptItem } from "../model/receipt";
import FetchRewards from "../api/fetchRewards";
import { useNavigate } from "react-router-dom";

const App: FC<unknown> = () => {
  const navigate = useNavigate();

  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [receiptItems, setReceiptItems] = useState<
    Array<ReceiptItem>
  >([]);
  const [receiptId, setReceiptId] = useState<string>("");

  const viewReceiptPoints = () => {
    setError("");
    if (!receiptId) {
      setError("Please submit a receipt to view its accrued points");
      return;
    }

    FetchRewards.getReceiptPoints(receiptId).then(
      (receiptPoints) => {
        console.log(
          `Your receipt has accrued ${receiptPoints.points} points, nice job!`
        );
      },
      (err) => {
        console.error(`Error fetching receipt points -- ${err}`);
        setError("Error getting receipt points");
      }
    );
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData(event.currentTarget);

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

    FetchRewards.processReceipt(newReceipt).then(
      (receiptId) => {
        console.log(
          `Receipt processed successfully -- id: ${receiptId.id}`
        );
        setSuccess("Receipt successfully submitted!");
        setReceiptId(receiptId.id);
      },
      (err) => {
        console.error(err);
        setError("Error process receipt");
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
        mt: { md: 10 },
      }}
    >
      <Paper elevation={9} sx={{ p: 4 }}>
        <Grid justifyContent="center" alignItems="center">
          {receiptId && (
            <Grid
              item
              xs={12}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="contained" onClick={viewReceiptPoints}>
                View Receipt Points
              </Button>
            </Grid>
          )}
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
              <Alert
                severity="error"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {error}
              </Alert>
            </Grid>
          )}

          {/* success snackbar */}
          {success && (
            <Grid item xs={12}>
              <Alert
                severity="success"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {success}
              </Alert>
            </Grid>
          )}

          {/* retailer name field */}
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              label="Retailer Name"
              name="retailer-name"
            />
          </Grid>

          {/* purchase date field */}
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              label="Purchase Date"
              name="purchase-date"
            />
          </Grid>

          {/* purchase time field */}
          <Grid item xs={12} sx={{ mt: 2, mb: 4 }}>
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              label="Purchase Time"
              name="purchase-time"
            />
          </Grid>
          <Divider />

          {/* items purchased field */}
          <AddPurchasedItemComponent
            onChange={(receiptItems) => setReceiptItems(receiptItems)}
          />

          <Divider />
          {/* total amount field */}
          <Grid item xs={12} sx={{ mt: 3 }}>
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
              variant="outlined"
              size="medium"
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
