import { Button, TextField, Typography } from "@mui/material";
import { FC, useState } from "react";
import { ReceiptItem } from "../model/receipt";


type PurchasedItemProps = {
  onChange?: (item: ReceiptItem) => void;
  receiptItem?: ReceiptItem;
};

const PurchasedItem: FC<PurchasedItemProps> = ({
  onChange,
  receiptItem
}) => {
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>("");
 
  const handleSubmit = () => {
    if (itemDescription && itemPrice) {
      const newItem: ReceiptItem = {
        shortDescription: itemDescription,
        price: itemPrice
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
      <Typography component="h3" variant="h4">
        Item
      </Typography>
      <TextField
        fullWidth
        disabled={!!receiptItem}
        size="medium"
        variant="outlined"
        label="Item Description"
        name="item-description"
        value={receiptItem?.shortDescription || itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}

      />
      <TextField
        fullWidth
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
          variant="contained"
          onClick={handleSubmit}
        >
          Add Item
        </Button>
      )}
    </>
  );
};

export default PurchasedItem;