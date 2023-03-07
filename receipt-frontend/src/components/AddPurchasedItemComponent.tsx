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

  return (
    <>
      {/* this is where we display the added receipt items */}
      {purchasedItems.map((item, index) => (
        <PurchasedItem
          key={`${item.price}-${index}`}
          receiptItem={item}
        />
      ))}

      {/* This is where you can add new receipt items */}
      <PurchasedItem onChange={handleReceiptItemChange} />
    </>
  );
};

export default AddPurchasedItemComponent;
