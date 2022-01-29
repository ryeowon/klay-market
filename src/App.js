import { getBalance, readCount, setCount } from "./api/UseCaver";
import React, { useState } from "react";
import * as KlipAPI from "./api/UseKilp";
import QRCode from "qrcode.react";

const DEFAULT_QR_CODE = "DEFAULT";

function App() {
  const [balance, setBalance] = useState("0");
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);

  const onClickGetAddress = () => {
    KlipAPI.getAddress(setQrvalue);
  };

  const onClickgSetCount = () => {
    KlipAPI.setCount(2000, setQrvalue);
  };

  readCount();
  getBalance("0x6867ea7ff72efa74da0a1f4c9aa52e7215a84029");
  return (
    <div>
      <button onClick={onClickGetAddress}>주소 가져오기</button>
      <button onClick={onClickgSetCount}>카운트 값 변경</button>
      <br />
      <QRCode value={qrvalue} />
    </div>
  );
}

export default App;
