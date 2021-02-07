import Web3 from "web3";
import { INFURA_LINK } from "../config";


export default async function GenerateBurnerAccount() {
    const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_LINK));
    let account = web3.eth.accounts.create(web3.utils.randomHex(32));
    return account
}
