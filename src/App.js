import { fetchCardsOf, getBalance, readCount, setCount } from "./api/UseCaver";
import React, { useEffect, useState } from "react";
import * as KlipAPI from "./api/UseKilp";
import QRCode from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Nav,
  Row,
} from "react-bootstrap";
import "./App.css";
import "./market.css";
import { MARKET_CONTRACT_ADDRESS } from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faWallet, faPlus } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

function App() {
  const [nfts, setNfts] = useState([]); // {id: '101', uri = ' '}
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState("MARKET"); // MARKET, MINT, WALLET
  const [mintImageUrl, setMintImageUrl] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "MODAL",
    onConfirm: () => {},
  });

  const rows = nfts.slice(nfts.lengths / 2);
  console.log(rows);
  const fetchMarketNFTs = async () => {
    const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
    setNfts(_nfts);
  };

  const fetchMyNFTs = async () => {
    if (myAddress === DEFAULT_ADDRESS) {
      alert("no address");
      return;
    }
    // balanceOf -> 내가 가진 전체 NFT 개수
    // tokenOfOwnerByIndex -> 내가 가진 NFT token ID 하나씩 가져옴
    // tokenURI -> tokenID를 이용해 toeknURI를 가져옴

    const _nfts = await fetchCardsOf(myAddress);
    setNfts(_nfts);
  };

  const getUserData = () => {
    setModalProps({
      title: "Klip 지갑을 연동하시겠습니까?",
      onConfirm: () => {
        KlipAPI.getAddress(setQrvalue, async (address) => {
          setMyAddress(address);
          const _balance = await getBalance(address);
          setMyBalance(_balance);
        });
      },
    });
    setShowModal(true);
  };

  const onClickMint = async (uri) => {
    if (myAddress === DEFAULT_ADDRESS) {
      alert("NO ADDRESS");
      return;
    } else {
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
      setModalProps({
        title: "NFT를 마켓에 올리시겠어요?",
        onConfirm: () => {
          onClickMyCard(id);
        },
      });
    } else if (tab == "MARKET") {
      setModalProps({
        title: "NFT를 구매하시겠어요?",
        onConfirm: () => {
          onClickMyCard(id);
        },
      });
    }
    setShowModal(true);
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

  useEffect(() => {
    getUserData();
    fetchMarketNFTs();
  }, []);

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
          {myAddress !== DEFAULT_ADDRESS ? `${myBalance}KLAY` : "지갑 연동하기"}
        </Alert>

        {qrvalue !== DEFAULT_QR_CODE ? (
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
        ) : null}

        {tab === "MARKET" || tab === "WALLET" ? (
          <div className="container">
            {rows.map((o, rowIndex) => {
              return (
                <Row>
                  <Col style={{ marginRight: 0, paddingRight: 0 }}>
                    <Card
                      onClick={() => {
                        onClickCard(nfts[rowIndex * 2].id);
                      }}
                    >
                      <Card.Img src={nfts[rowIndex * 2].uri} />
                    </Card>
                    {nfts[rowIndex * 2].id}NFT
                  </Col>
                  <Col style={{ marginRight: 0, paddingRight: 0 }}>
                    {nfts.length > rowIndex * 2 + 1 ? (
                      <>
                        <Card
                          onClick={() => {
                            onClickCard(nfts[rowIndex * 2 + 1].id);
                          }}
                        >
                          <Card.Img src={nfts[rowIndex * 2 + 1].uri} />
                        </Card>
                        {nfts[rowIndex * 2 + 1].id}NFT
                      </>
                    ) : null}
                  </Col>
                </Row>
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

      <Modal
        centered
        size="sm"
        show={showModal}
        onHide={() => {
          setModalProps(false);
        }}
      >
        <Modal.Header
          style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
        >
          <Modal.Title>{modalProps.title}</Modal.Title>
        </Modal.Header>
        <Modal.Footer
          style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
        >
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            닫기
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              modalProps.onConfirm();
              setShowModal(false);
            }}
            style={{ backgroundColor: "#810034", border: "#810034" }}
          >
            진행
          </Button>
        </Modal.Footer>
      </Modal>

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
              <div>
                <FontAwesomeIcon color="white" size="lg" icon={faHome} />
              </div>
            </div>
            <div
              onClick={() => {
                setTab("MINT");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>
                <FontAwesomeIcon color="white" size="lg" icon={faPlus} />
              </div>
            </div>
            <div
              onClick={() => {
                setTab("WALLET");
                fetchMyNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>
                <FontAwesomeIcon color="white" size="lg" icon={faWallet} />
              </div>
            </div>
          </div>
        </Nav>
      </nav>
    </div>
  );
}

export default App;
