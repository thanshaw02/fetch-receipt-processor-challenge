import { Box, Divider, Fade, Modal, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import FetchRewards from "../api/fetchRewards";
import Receipt from "../model/receipt";

type ReceiptPointsModalProps = {
  open: boolean;
  receiptId: string;
  receipt: Receipt;
  setIsModalOpen: () => void;
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ReceiptPointsModal: FC<ReceiptPointsModalProps> = ({
  open,
  receiptId,
  receipt,
  setIsModalOpen,
}) => {
  const [accruedReceiptPoints, setAccruedReceiptPoints] =
    useState<string>("");

  useEffect(() => {
    FetchRewards.getReceiptPoints(receiptId).then(
      (receiptPoints) => {
        setAccruedReceiptPoints(receiptPoints.points);
      },
      (err) => {
        console.error(
          `Error fetching receipt points by id "${receiptId}" -- ${err}`
        );
      }
    );
  }, [receiptId]);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={setIsModalOpen}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              Accrued Receipt Points
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                mt: 2,
                mb: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              This is for the receipt from {receipt.retailer} on {receipt.purchaseDate}
            </Typography>
            <Divider />
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {accruedReceiptPoints}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ReceiptPointsModal;
