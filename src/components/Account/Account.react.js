import React, { useCallback, useEffect, useState, useContext } from "react";
// import { Button } from "antd";
import {
  Button,
  Text
} from "tabler-react";
import Identicon from "../Identicon.react"

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { useUserAddress } from "eth-hooks";
import { shortenAddress } from "../../utils"
import { INFURA_ID } from "../../utils/constants"
import {Web3Context} from '../../App.react';

const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/"+INFURA_ID)
// const localProviderUrl = "http://"+window.location.hostname+":8545";
// const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
// const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

function Account({}) {
  const [injectedProvider, setInjectedProvider] = useState();
  const web3Context = useContext(Web3Context);
  const modalButtons = [];
  const userProvider = injectedProvider;
  let address = useUserAddress(userProvider);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    const newProvider = new Web3Provider(provider);
    web3Context.updateProvider(newProvider);
    setInjectedProvider(newProvider);
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          size="md"
          outline
          color="secondary"
          RootComponent="a"
          className="d-none d-md-flex"
          key="logoutbutton"
          onClick={logoutOfWeb3Modal}
        >
          Disconnect 
        </Button>
      );
    } else {
      modalButtons.push(
        <Button
          size="md"
          outline
          color="secondary"
          RootComponent="a"
          className="d-none d-md-flex"
          key="loginbutton"
          onClick={loadWeb3Modal}
        >
          Connect Wallet
        </Button>
      );
    }
  }

  return (
    <React.Fragment>
      {
        !!address && (
          <Text className={'mr-2'}>{shortenAddress(address)}</Text>
        )
      }
      {modalButtons}
    </React.Fragment>
  );
}

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default Account;