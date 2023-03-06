import Receipt, { ReceiptId, ReceiptPoints } from "../model/receipt";

const processReceipt = (receipt: Receipt): Promise<ReceiptId> => {
  const requestInfo = {
    method: "POST",
    headers: {
      Accept: "application/json",
      // "Access-Control-Allow-Origin": "http://localhost:8000",
      // "Content-Type": "application/json",
    },
    body: JSON.stringify(receipt),
  };

  return new Promise((resolve, reject) => {
    fetch("http://localhost:8000/receipts/process", requestInfo).then(
      (response) => {
        if (!response.ok)
          reject(
            `Status code: ${response.status}\nError message: ${response.statusText}`
          );
        resolve(response.json());
      },
      reject
    );
  });
};

const getReceiptPoints = (
  receiptId: string
): Promise<ReceiptPoints> => {
  const requestInfo = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    fetch(
      `http://localhost:8000/receipts/${receiptId}/points`,
      requestInfo
    ).then((response) => {
      if (!response.ok)
        reject(
          `Status code: ${response.status}\nError message: ${response.statusText}`
        );
      resolve(response.json());
    }, reject);
  });
};

const FetchRewards = {
  processReceipt,
  getReceiptPoints,
};

export default FetchRewards;
