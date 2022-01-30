import Caver from "caver-js";
import CounterABI from "../abi/CounterABI.json";
import KIP17ABI from "../abi/KIP17TokenABI.json";
import {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  COUNT_CONTRACT_ADDRESS,
  MARKET_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  CHAIN_ID,
} from "../constants";

const option = {
  headers: [
    {
      name: "Authorization",
      value:
        "Basic " +
        Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
    },
    { name: "x-chain-id", value: CHAIN_ID },
  ],
};

const caver = new Caver(
  new Caver.providers.HttpProvider(
    "https://node-api.klaytnapi.com/v1/klaytn",
    option
  )
);

const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);

export const fetchCardsOf = async (address) => {
  // fetch balance
  const balance = await NFTContract.methods.balanceOf(address).call();
  console.log("Balance", balance);

  // fetch token IDs
  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
    tokenIds.push(id);
  }

  // fetch token URIs
  const tokenUris = [];
  for (let i = 0; i < balance; i++) {
    const id = await NFTContract.methods.tokenURI(tokenIds[i]).call();
    tokenUris.push(id);
  }

  const nfts = [];
  for (let i = 0; i < balance; i++) {
    nfts.push({ uri: tokenUris[i], id: tokenIds[i] });
  }
  console.log("nft", nfts);

  return nfts;
};

export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.convertFromPeb(
      caver.utils.hexToNumberString(response)
    );
    console.log("Balance", balance);
    return balance;
  });
};
/*

const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);

export const readCount = async () => {
  const _count = await CountContract.methods.count().call();
  console.log(_count);
};

export const setCount = async (newCount) => {
  try {
    //사용할 account 설정
    const privatekey =
      "0x0043ed161aac3d5a45419c33c3c89c01c068f76db0a25c7faa00265ec407fc29";
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);

    const receipt = await CountContract.methods.setCount(newCount).send({
      from: deployer.address, //address
      gas: "0x4bfd200",
    });
    console.log(receipt);
  } catch (e) {
    console.log("Error set count", e);
  }
};
*/
