// @flow

import React, { useContext, useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

import {
  Page,
  Grid,
  Dimmer,
  Text,
  Form,
  Header
} from "tabler-react";
import Confetti from 'react-confetti'

import Button from "../components/tablerReactAlt/src/components/Button";

import {
  Accordion
} from 'react-accessible-accordion';

import Card from "../components/tablerReactAlt/src/components/Card";
import DefiTrainEarningsCard from "../components/DefiTrainEarningsCard";
import SiteWrapper from "../SiteWrapper.react";

import { useTokenPrices, useLendingMarketMetrics, useAddressBalances, useContractLoader, useInterval } from "../hooks";
import { default as protektData } from "../data";
import { infuraProvider } from "../config";
import { GetBalanceOfERC20ForAddress } from '../utils'

import _ from 'lodash';


import { Web3Context } from '../App.react';


/*  
    Page does not require a connected wallet - simply pull from the contract address passed in params
    - for new users who may not have a wallet initially connected.
*/

const YourEarningsSimple = ({match, location})  => {

  const web3Context = useContext(Web3Context);
  const [requeryToggle, setRequeryToggle] = useState(false);
  const [balance, setBalance] = useState(0)
  const [interest, setInterest] = useState(0)
  const contracts = useContractLoader(web3Context.provider);

  const tokenPrices = useTokenPrices(
    infuraProvider,
    ['usdc','ausdc'] 
  );

  const {params : {address} } = match;

  useEffect(() => {

    // gets balance of pToken 
    (async function() {
      let erc20Balance = await GetBalanceOfERC20ForAddress(
        protektData['contracts']['pausdc']['address'],protektData['contracts']['pausdc']['abi'],address,6
      );
      let balance = 0
      if(!_.isEmpty(tokenPrices)){
        balance = tokenPrices['usdc']['usd'] * erc20Balance
      }
      setBalance(balance)
    })();

    // get current interest of burner account
    (async function() {
      let erc20Balance = await GetBalanceOfERC20ForAddress(
        protektData['contracts']['ausdc']['address'],protektData['contracts']['ausdc']['abi'],address,6
      );
      let balance = 0
      if(!_.isEmpty(tokenPrices)){
        balance = tokenPrices['ausdc']['usd'] * erc20Balance
      }
      setInterest(balance)
    })();


  },[tokenPrices]);

  useInterval(() => {
    if(balance > 0){
      let secondsPerYear = 31536000 
      let APY = 0.11
      let SPY = APY/ secondsPerYear 
      let interestThisSecond = interest + ((balance * (1 + SPY)) - balance)
      setInterest(interestThisSecond);
    }
  }, 1000);

  return (
    <SiteWrapper>
      <Confetti/>
        <Page.Content>
        <div className="earnings-image">
          <Grid.Row className="full-height center-items">
              <Grid.Col width={4}></Grid.Col>
              <Grid.Col width={4}>
                  <div className="full-height center-items">
                    <div className="center-text full-width">
                      <h3>Your Earnings</h3>
                        <NumberFormat 
                          value={balance + interest} 
                          displayType={'text'} 
                          thousandSeparator={true} 
                          prefix={'$'} 
                          decimalScale={7}
                          renderText={value => 
                            <h1 className="rainbow-text">{value}</h1>
                          } 
                        />
                    </div>
                  </div>
              </Grid.Col>
              <Grid.Col width={4}></Grid.Col>
            </Grid.Row>
        </div>
        </Page.Content>

        <Grid.Row className="d-flex justify-content-center">
          <Grid.Col sm={12} lg={8}>
            <Card className="mt-9" title={(<h2 className="mb-0">How it Works</h2>)}>
            <Card.Body>
                <Text>
🚂 A friend has bought you a $50 ticket to board the DeFi train!
                </Text>
                <br/>
                <Text>
👻 Your $50 has been deposited into Aave and you can see it earning interest already above! 
                </Text>
                <br/>
                <Text>
🤔 To access the new decentralized web and use your earnings with decentralized apps theres a few more steps...
                </Text>
                <br/>
                <Text>
🤗 We've put together a quick guide <a href="/onboarding">here</a> to get you started!
                </Text>
                <br/>
                <br/>
                <Text>
Cheers,<br/>
🛡🛡 <a href={`https://www.protektprotocol.com/`} target="_blank">Protekt Protocol Team</a> 🛡🛡
                </Text>
            </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>

      
      
    </SiteWrapper>
  )
}

export default YourEarningsSimple;