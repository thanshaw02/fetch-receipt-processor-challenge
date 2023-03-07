import { FC, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ReceiptItem } from "../model/receipt";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { v4 as uuid } from "uuid";

type PurchasedItemProps = {
  receiptItem?: ReceiptItem;
  handleAddItem?: (item: ReceiptItem) => void;
  handleEditItem?: (
    id: string,
    description: string,
    price: string
  ) => void;
};

const PurchasedItem: FC<PurchasedItemProps> = ({
  receiptItem,
  handleAddItem,
  handleEditItem,
}) => {
  const [editingDisabled, setEditingDisabled] = useState<boolean>(
    !!receiptItem
  );
  const [itemDescription, setItemDescription] = useState<string>(
    receiptItem?.shortDescription || ""
  );
  const [itemPrice, setItemPrice] = useState<string>(
    receiptItem?.price || ""
  );
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
      id: uuid(),
      shortDescription: itemDescription,
      price: itemPrice,
    };

    if (handleAddItem) {
      handleAddItem(newItem);
    }
    setItemDescription("");
    setItemPrice("");
    setError("");
  };

  const handleEditItemClick = () => {
    // TODO: issue #20
    // this is messy, basically checking if this receipt item component isn't the one at the bottom where you add receipt items
    // the one at the bottom in the form won't have a receipt item or handleEditItem attribute passed to it
    if (!editingDisabled && handleEditItem && receiptItem) {
      handleEditItem(receiptItem.id, itemDescription, itemPrice);
      setEditingDisabled(true);
      return;
    }
    setEditingDisabled(false);
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
          disabled={editingDisabled}
          size="small"
          variant="outlined"
          label="Item Description"
          name="item-description"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
        />
        <TextField
          disabled={editingDisabled}
          size="small"
          variant="outlined"
          label="Item Price"
          name="item-price"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
        <IconButton
          aria-label="edit-item"
          disabled={!receiptItem}
          onClick={handleEditItemClick}
        >
          <EditIcon />
        </IconButton>
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
