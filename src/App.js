import { getBalance, readCount, setCount } from "./api/UseCaver";
import React, { useState } from "react";
import * as KlipAPI from "./api/UseKilp";
import QRCode from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Container } from "react-bootstrap";
import "./App.css";
import "./market.css";

const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00";

function App() {
  const [nfts, setNfts] = useState([]);
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);

  // fetchMarketNFTs
  // fetchMyNFTs
  // onClickMint
  // onClickMyCard
  // onClickMarktetCard
  // getUserData
  // getBalance

  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await getBalance(address);
      setMyBalance(_balance);
    });
  };

  return (
    <div className="App">
      <div style={{ backgroundColor: "black", padding: 10 }}>
        <div style={{ fontSize: 30, fontWeight: "bold" }}>My Wallet</div>
        {myAddress}
        <br />
        <Alert
          onClick={getUserData}
          variant={"balance"}
          style={{ backgroundColor: "#ccebff", fontSize: 25 }}
        >
          {myBalance}KLAY
        </Alert>
      </div>

      <Container
        style={{
          backgroundColor: "white",
          width: 300,
          height: 300,
          padding: 20,
        }}
      >
        <QRCode value={qrvalue} size={256} style={{ margin: "auto" }} />
      </Container>
    </div>
  );
}

export default App;
