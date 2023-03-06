import { Box, TextField, Typography } from "@mui/material";
import { FC, useState } from "react";
import { ReceiptItem } from "../model/receipt";


type PurchasedItemProps = {
  receiptItem?: ReceiptItem;
};

const PurchasedItem: FC<PurchasedItemProps> = ({
  receiptItem
}) => {
  const [item, setItem] = useState<ReceiptItem | undefined>(receiptItem);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const itemDescription = formData.get("item-description");
    if (!itemDescription) {
      // do some error sutff
    }

    const itemPrice = formData.get("item-price");
    if (!itemPrice) {
      // do some error stuff
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography component="h3" variant="h4">
        Item
      </Typography>
      <TextField
        fullWidth
        size="medium"
        variant="outlined"
        label="Item Description"
        name="item-description"
        value={item?.shortDescription || ""}

      />
      <TextField
        fullWidth
        size="medium"
        variant="outlined"
        label="Item Price"
        name="item-price"
        value={item?.price || ""}
      />
    </Box>
  );
};

export default PurchasedItem;