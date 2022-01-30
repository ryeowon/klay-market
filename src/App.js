import { fetchCardsOf, getBalance, readCount, setCount } from "./api/UseCaver";
import React, { useState } from "react";
import * as KlipAPI from "./api/UseKilp";
import QRCode from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Card, Container, Form, Nav } from "react-bootstrap";
import "./App.css";
import "./market.css";
import { MARKET_CONTRACT_ADDRESS } from "./constants";

const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x2bc2C46165b64A3AF6A257B9fF882A1f7BeBc327";

function App() {
  const [nfts, setNfts] = useState([]); // {id: '101', uri = ' '}
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState("MARKET"); // MARKET, MINT, WALLET
  const [mintImageUrl, setMintImageUrl] = useState("");

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

  const onClickMint = async (uri) => {
    if (myAddress === DEFAULT_ADDRESS) alert("NO ADDRESS");
    else {
      const randomTokenId = parseInt(Math.random() * 10000000);
      KlipAPI.MintCardWithURI(
        myAddress,
        randomTokenId,
        uri,
        setQrvalue,
        (result) => {
          alert(JSON.stringify(result));
        }
      );
    }
  };

  const onClickCard = (id) => {
    if (tab == "WALLET") {
      onClickMyCard(id);
    } else if (tab == "MARKET") {
      onClickMarketCard(id);
    }
  };

  const onClickMyCard = (tokenId) => {
    KlipAPI.listingCard(myAddress, tokenId, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    });
  };

  const onClickMarketCard = (tokenId) => {
    KlipAPI.buyCard(tokenId, setQrvalue, (result) => {
      alert(JSON.stringify(result));
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
        {tab === "MARKET" || tab === "WALLET" ? (
          <div className="container">
            {nfts.map((nft, index) => {
              return (
                <Card.Img
                  key={`imagekey${index}`}
                  onClick={() => onClickCard(nft.id)}
                  style={{ width: 300 }}
                  className="img-responsive"
                  src={nft.uri}
                />
              );
            })}
          </div>
        ) : null}
        {tab === "MINT" ? (
          <div className="container" style={{ padding: 0, width: "100%" }}>
            <Card
              className="text-center"
              style={{ color: "black", height: "50%", borderColor: "#C5B358" }}
            >
              <Card.Body style={{ opacity: 0.9, backgroundColor: "black" }}>
                {mintImageUrl !== "" ? (
                  <Card.Img src={mintImageUrl} height={"50%"} />
                ) : null}
                <Form>
                  <Form.Group>
                    <Form.Control
                      value={mintImageUrl}
                      onChange={(e) => {
                        setMintImageUrl(e.target.value);
                      }}
                      type="text"
                      placeholder="이미지 주소를 입력해주세요"
                    />
                  </Form.Group>
                  <Button
                    onClick={() => onClickMint(mintImageUrl)}
                    variant="primary"
                    style={{
                      backgroundColor: "#810034",
                      borderColor: "#810034",
                    }}
                  >
                    발행하기
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        ) : null}
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
      <nav
        style={{ backgroundColor: "#1b1717", height: 45 }}
        className="navbar fixed-bottom-navbar-light"
        role="navigation"
      >
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">
            <div
              onClick={() => {
                setTab("MARKET");
                fetchMarketNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>MARKET</div>
            </div>
            <div
              onClick={() => {
                setTab("MINT");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>MINT</div>
            </div>
            <div
              onClick={() => {
                setTab("WALLET");
                fetchMyNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>WALLET</div>
            </div>
          </div>
        </Nav>
      </nav>
    </div>
  );
}

export default App;
