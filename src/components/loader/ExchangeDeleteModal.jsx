import React from "react";
import Loader from "./Loader";
import { Card } from "react-bootstrap";

const DELETE_MSG = {
  xlm: "Open your LOBSTR App to confirm the Delete Order.",
  xrp: "Open your XUMM App to confirm the Delete Order.",
};

const ExchangeDeleteModal = ({ network = "xrp" }) => {
  return (
    <div className="swapTransModal">
      <Card className="swapModal-card shadow-lg py-3">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Delete Offer</Card.Title>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <Loader />
          </div>
          <p className="mb-2 text-center">{DELETE_MSG[network]}</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ExchangeDeleteModal;
