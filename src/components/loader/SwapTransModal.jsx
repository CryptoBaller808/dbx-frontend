import React from "react";
import { Card } from "react-bootstrap";
import Loader from "./Loader";

const SwapTransModal = ({ swapfrom, swapTo, swapFromCurrency, swapToCurrency }) => {
  let fixedSwapTo = parseFloat(swapTo).toFixed(5);
  let fixedSwapFrom = Number.isInteger(Number(swapfrom)) ? swapfrom : parseFloat(swapfrom).toFixed(5);
  return (
    <div className="swapTransModal">
      <Card className="swapModal-card shadow-lg py-3">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Waiting for confirmation</Card.Title>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <Loader />
          </div>

          <p className="mb-2 text-center">
            Swapping{" "}
            <span className="fw-bold">
              {fixedSwapFrom} {swapFromCurrency}
            </span>{" "}
            for{" "}
            <span className="fw-bold">
              {fixedSwapTo} {swapToCurrency}
            </span>
          </p>
          <p className="mb-2 text-center">Confirm this transaction in your wallet</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SwapTransModal;
