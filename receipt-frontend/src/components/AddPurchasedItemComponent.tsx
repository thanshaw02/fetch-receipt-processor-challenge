import { FC, useState } from "react";
import { ReceiptItem } from "../model/receipt";
import PurchasedItem from "./PurchasedItem";

const AddPurchasedItemComponent: FC<unknown> = () => {
  const [purchasedItems, setPurchasedItems] = useState<Array<ReceiptItem>>([]);

  return (
    <>
      {/* this is where we display the added receipt items */}
      {purchasedItems.map((item) => (
        <PurchasedItem receiptItem={item}/>
      ))}

      {/* This is where you can add new receipt items */}
      <PurchasedItem
        onChange={(item: ReceiptItem) =>  setPurchasedItems((oldArr) => [...oldArr, item])}
      />
    </>
  );
};

export default AddPurchasedItemComponent;