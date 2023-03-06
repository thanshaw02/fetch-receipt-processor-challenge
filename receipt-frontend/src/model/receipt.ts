
export type ReceiptId = {
  id: string;
}

export type ReceiptPoints = {
  points: string;
}

export type ReceiptItem = {
  shortDescription: string;
  price: string;
};

type Receipt = {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: Array<ReceiptItem>;
  total: string;
};

export default Receipt;