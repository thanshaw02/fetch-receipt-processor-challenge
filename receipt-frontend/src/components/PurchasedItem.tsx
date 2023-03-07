import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { ReceiptItem } from "../model/receipt";
import AddIcon from "@mui/icons-material/Add";

type PurchasedItemProps = {
  onChange?: (item: ReceiptItem) => void;
  receiptItem?: ReceiptItem;
};

const PurchasedItem: FC<PurchasedItemProps> = ({
  onChange,
  receiptItem,
}) => {
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = () => {
    if (!itemDescription) {
      setError("Please enter the items description");
      return;
    }

    if (!itemPrice) {
      setError("Please enter the items price");
      return;
    }

    const newItem: ReceiptItem = {
      shortDescription: itemDescription,
      price: itemPrice,
    };

    if (onChange) {
      onChange(newItem);
    }
    setItemDescription("");
    setItemPrice("");
    setError("");
  };

  return (
    <>
      <Typography component="h5" variant="h6" sx={{ mt: 2, mb: 2 }}>
        {receiptItem ? receiptItem.shortDescription : "Add Item"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          sx={{ mr: 2 }}
          disabled={!!receiptItem}
          size="small"
          variant="outlined"
          label="Item Description"
          name="item-description"
          value={receiptItem?.shortDescription || itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
        />
        <TextField
          disabled={!!receiptItem}
          size="small"
          variant="outlined"
          label="Item Price"
          name="item-price"
          value={receiptItem?.price || itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
      </Box>
      {!receiptItem && (
        <Button
          fullWidth
          sx={{ mt: 2, mb: 4 }}
          variant="outlined"
          size="medium"
          onClick={handleSubmit}
          startIcon={<AddIcon />}
        >
          Add Item
        </Button>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {error}
        </Alert>
      )}
    </>
  );
};

export default PurchasedItem;
