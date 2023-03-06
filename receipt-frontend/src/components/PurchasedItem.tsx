import {
  Box,
  Button,
  // Grid,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { ReceiptItem } from "../model/receipt";

type PurchasedItemProps = {
  onChange?: (item: ReceiptItem) => void;
  receiptItem?: ReceiptItem;
  index?: number;
};

const PurchasedItem: FC<PurchasedItemProps> = ({
  onChange,
  receiptItem,
  index,
}) => {
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>("");

  const handleSubmit = () => {
    if (itemDescription && itemPrice) {
      const newItem: ReceiptItem = {
        shortDescription: itemDescription,
        price: itemPrice,
      };

      if (onChange) {
        onChange(newItem);
      }
      setItemDescription("");
      setItemPrice("");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography component="h5" variant="h6">
        {receiptItem ? receiptItem.shortDescription : "Add Item"}
      </Typography>
      <TextField
        sx={{ mr: 2 }}
        disabled={!!receiptItem}
        size="medium"
        variant="outlined"
        label="Item Description"
        name="item-description"
        value={receiptItem?.shortDescription || itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
      />
      <TextField
        disabled={!!receiptItem}
        size="medium"
        variant="outlined"
        label="Item Price"
        name="item-price"
        value={receiptItem?.price || itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
      />
      {!receiptItem && (
        <Button
          fullWidth
          sx={{ mt: 2 }}
          variant="contained"
          onClick={handleSubmit}
        >
          Add Item
        </Button>
      )}
    </Box>
  );
};

export default PurchasedItem;
