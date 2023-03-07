import { FC, useState } from "react";
import { ReceiptItem } from "../model/receipt";
import PurchasedItem from "./PurchasedItem";

type AddPurchasedItemComponentProps = {
  onChange: (items: Array<ReceiptItem>) => void;
};

const AddPurchasedItemComponent: FC<
  AddPurchasedItemComponentProps
> = ({ onChange }) => {
  const [purchasedItems, setPurchasedItems] = useState<
    Array<ReceiptItem>
  >([]);

  const handleReceiptItemChange = (item: ReceiptItem) => {
    const updatedArray = [...purchasedItems, item];
    setPurchasedItems(updatedArray);
    onChange(updatedArray);
  };

  const handleEditItem = (
    itemId: string,
    itemDescription: string,
    itemPrice: string
  ) => {
    const updatedArray = purchasedItems.map((item) => {
      if (item.id === itemId) {
        return {
          id: itemId,
          shortDescription: itemDescription,
          price: itemPrice,
        };
      }
      return item;
    });
    setPurchasedItems(updatedArray);
    onChange(updatedArray);
  };

  return (
    <>
      {/* this is where we display the added receipt items */}
      {purchasedItems.map((item, index) => (
        <PurchasedItem
          key={`${item.price}-${index}`}
          receiptItem={item}
          handleEditItem={handleEditItem}
        />
      ))}

      {/* This is where you can add new receipt items */}
      <PurchasedItem handleAddItem={handleReceiptItemChange} />
    </>
  );
};

export default AddPurchasedItemComponent;
