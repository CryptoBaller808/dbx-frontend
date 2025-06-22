import React, { useEffect } from "react";
import { Navbar, Container, NavDropdown, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./style.css";
import DBX from "../../Images/DBX horizontal.svg";
import Drawarlogo from "../../Images/trading 1.png";
import Drawarlogo1 from "../../Images/exchange (4) 1.png";
import Drawarlogo2 from "../../Images/swap (1) 1.png";
import Drawarlogo3 from "../../Images/nft 1.png";
import Drawarlogo4 from "../../Images/online-order 1.png";
import Drawarlogo5 from "../../Images/user 1.png";
import { useDispatch } from "react-redux";
import { setModalOpen } from "../../redux/actions";
import { Drawer } from "antd";

function Navbar2Component() {
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);

  const handleClickOpen = () => {
    dispatch(setModalOpen(true));
  };
  const handleClose = () => {
    // setWalletConnected(false);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  return (
    <>
      <div>
        <Navbar collapseOnSelect expand="lg" className="Mainnav">
          <Container fluid>
            <Link to="/">
              {" "}
              <Navbar.Brand href="#home">
                <img src={DBX} alt="" style={{ width: "20rem" }} />
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              onClick={showDrawer}
            ></Navbar.Toggle>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>
              <Nav className="me-auto">
                <Link to="/">
                  {" "}
                  <Nav.Link href="#features" className="navtext">
                    Home
                  </Nav.Link>
                </Link>
                <Link to="/buysell">
                  {" "}
                  <Nav.Link href="#pricing" className="navtext">
                    Buy/Sell
                  </Nav.Link>
                </Link>
                <Link to="/exchange">
                  <Nav.Link href="#pricing" className="navtext">
                    Exchange
                  </Nav.Link>
                </Link>
                <Link to="/swap">
                  {" "}
                  <Nav.Link href="#pricing" className="navtext">
                    Swap
                  </Nav.Link>
                </Link>
                <Link to="/nft">
                  <Nav.Link href="#pricing" className="navtext">
                    NFT
                  </Nav.Link>
                </Link>

                {/* <NavDropdown title="Earn" id="collasible-nav-dropdown">
                <Link to="/earn">
                  <NavDropdown.Item href="#action/3.1">Earn</NavDropdown.Item>
                </Link>
                <Link to="/cryto">
                  <NavDropdown.Item href="#action/3.2">Cryto</NavDropdown.Item>
                </Link>
                <Link to="/stakebtr">
                  <NavDropdown.Item href="#action/3.3">
                    Stakebtr
                  </NavDropdown.Item>
                </Link>
                <Link to="/stakebtrone">
                  <NavDropdown.Item href="#action/3.4">
                    StakeBtrOne
                  </NavDropdown.Item>
                </Link>
              </NavDropdown> */}
                <NavDropdown title="Order" id="collasible-nav-dropdown">
                  <NavDropdown.Item>
                    <Link to="/orders/openorders">Spot Orders</Link>
                  </NavDropdown.Item>
                </NavDropdown>
                <Link to=" ">
                  <Nav.Link href="#pricing" className="navtext">
                    DBX Coin
                  </Nav.Link>
                </Link>
                <Link to=" ">
                  <Nav.Link href="#pricing" className="navtext">
                    DBX Card
                  </Nav.Link>
                </Link>
                {/* <NavDropdown title="Assets" id="collasible-nav-dropdown">
                <NavDropdown.Item>
                  <Link to="/assets/overview">Overview</Link>
                </NavDropdown.Item>
              </NavDropdown> */}
              </Nav>
              <Nav className="mainbtnn">
                <Nav.Link href="#deets" className="mainbtn">
                  <div>
                    <img
                      style={{ marginLeft: "-.5rem", width: "2.5rem" }}
                      src="XRPL.png"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="xpr">XRP Ledger</p>
                  </div>
                  <div>
                    <img
                      style={{ marginLeft: ".5rem" }}
                      src="drop.png"
                      alt=""
                    />
                  </div>
                </Nav.Link>

                <Nav.Link href="#deets" className="mainbtn">
                  <div>
                    <p className="xpr1">180.564295</p>
                  </div>
                  <div>
                    <p className="xpr1">XRP</p>
                  </div>
                  <div className="xpr33">
                    <p style={{ marginTop: ".5rem" }}>r3rhW...w96W</p>
                  </div>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <div>
        <Drawer
          width={220}
          placement="right"
          onClose={onClose}
          visible={visible}
        >
          <div className="divddlog">
            <img src={Drawarlogo} alt="" />
            <Link to="/buysell">
              {" "}
              <p className="butext">Buy / Sell</p>{" "}
            </Link>
          </div>
          <div className="divddlog">
            <img src={Drawarlogo1} alt="" />
            <Link to="/exchange">
              <p className="butext">Exchange</p>
            </Link>
          </div>
          <div className="divddlog">
            <img src={Drawarlogo2} alt="" />
            <Link to="/swap">
              <p className="butext">Swap</p>
            </Link>
          </div>
          <div className="divddlog">
            <img src={Drawarlogo3} alt="" />

            <p className="butext">NFT</p>
          </div>
          <div className="divddlog">
            <img src={Drawarlogo4} alt="" />
            <Link to="/orders/openorders">
              <p className="butext">Orders</p>
            </Link>
          </div>
          <div className="divddlog">
            <img src={Drawarlogo1} alt="" />

            <p className="butext">DBX Coin </p>
          </div>
          <div className="divddlog">
            <img src={Drawarlogo5} alt="" />

            <p className="butext">DBX Card</p>
          </div>
        </Drawer>
      </div>
    </>
  );
}

export default Navbar2Component;
