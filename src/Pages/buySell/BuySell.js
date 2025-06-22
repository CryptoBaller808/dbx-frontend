import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./style.css";
import Logocard from "../../Images/visa 1.png";
import Logocard1 from "../../Images/MastercardLogo 1.png";
import Logocard2 from "../../Images/apple-pay 1.png";
import Headerlogo from "../../Images/Buy Sell Banner A V01.svg";

function BuySell() {
  return (
    <div className="buyselmain">
      <div>
        <img className="headerlogo" src={Headerlogo} alt="" />
      </div>
      <Container>
        <Row className="row222">
          <Col lg={4} md={5} xs={10} className="firstcol">
            <div>
              <img className="img7" src="image 7.png" alt="" />
            </div>
            <br></br>
            <br></br>
            <div>
              <h3 className="legend">Legend Trading</h3>
            </div>
            <br></br>
            <br></br>
            <div>
              <p
                className="cardtext111 greycolormilja"
                style={{ lineHeight: "2rem" }}
              >
                Low fee: trading fee as low as 0.08%
                <br /> No wire fee for ACH USD payments. <br /> International
                Wire Transfer: USD/EUR/GBP/ <br />
                HKD/SGD/AUD/CHF/MXN available
              </p>
            </div>
            <br></br>
            <div>
              <button className="buybtn">Buy/Sell</button>
            </div>
          </Col>

          <Col lg={4} md={5} xs={10} className="firstcol">
            <div>
              <img className="img10" src="image 10.png" alt="" />
            </div>
            <br></br>
            <br></br>
            <div>
              <h3 className="legend">Credit Card- Simplex</h3>
            </div>
            <br></br>
            <br></br>
            <div>
              <p
                className="cardtext111 greycolormilja"
                style={{ lineHeight: "2rem" }}
              >
                Average of 10-30 mins for cryptocurrency to <br /> reach your
                wallet. Convenient: Visa and <br /> MasterCard accepted
              </p>
              <div className="cardlogodiv">
                <img className="cardlogo" src={Logocard} alt="" />
                <img className="cardlogo" src={Logocard1} alt="" />
                <img className="cardlogo" src={Logocard2} alt="" />
              </div>
            </div>

            <div>
              <button className="buybtn">Buy</button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BuySell;
