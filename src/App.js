import { fetchCardsOf, getBalance, readCount, setCount } from "./api/UseCaver";
import React, { useState } from "react";
import * as KlipAPI from "./api/UseKilp";
import QRCode from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Card, Container } from "react-bootstrap";
import "./App.css";
import "./market.css";
import { MARKET_CONTRACT_ADDRESS } from "./constants";

const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00";

function App() {
  const [nfts, setNfts] = useState([]); // {tokenId: '101', tokenUri = ' '}
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
  const fetchMarketNFTs = async () => {
    const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
    setNfts(_nfts);
  };

  const fetchMyNFTs = async () => {
    // balanceOf -> 내가 가진 전체 NFT 개수
    // tokenOfOwnerByIndex -> 내가 가진 NFT token ID 하나씩 가져옴
    // tokenURI -> tokenID를 이용해 toeknURI를 가져옴

    const _nfts = await fetchCardsOf(myAddress);
    setNfts(_nfts);
  };

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
          style={{ backgroundColor: "#ccebff", fontSize: 25, color: "black" }}
        >
          {myBalance}KLAY
        </Alert>

        <div className="container">
          {nfts.map((nft, idx) => {
            return <Card.Img className="img-responsive" src={nfts[idx].uri} />;
          })}
        </div>
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
      <button style={{ color: "white" }} onClick={fetchMyNFTs}>
        aaa
      </button>
    </div>
  );
}

export default App;
