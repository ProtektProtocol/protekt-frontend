import Web3 from "web3";
import { INFURA_LINK } from "../config";

// this should probably just be renamed to "notifier"
// it is basically just a wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify

export default async function GetBalanceOfERC20ForAddress(contractAddress,abi,publicKey,decimals=18) {
    console.log('within getbalances')
    console.log(contractAddress)
    console.log(publicKey)
    const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_LINK));
    let erc20Contract = await new web3.eth.Contract(abi,contractAddress);
    var balance = await erc20Contract.methods.balanceOf(publicKey).call({ from: publicKey });
    balance = parseFloat(balance)/ (10**decimals)
    return balance
}
