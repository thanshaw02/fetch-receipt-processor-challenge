import { Box, Button, TextField, Typography } from "@mui/material";
import { FC, useState } from "react";
import { ReceiptItem } from "../model/receipt";

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
        >
          Add Item
        </Button>
      )}
    </>
  );
};

export default PurchasedItem;
