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
      console.log(` aUSDC ${balance}`)
      setInterest(balance)
    })();


  },[tokenPrices]);

  useInterval(() => {
    if(balance > 0){
      let secondsPerYear = 31536000 
      let APY = 0.11
      let SPY = APY/ secondsPerYear 
      let interestThisSecond = interest + ((balance * (1 + SPY)) - balance)
      console.log(interestThisSecond + interest)
      setInterest(interestThisSecond);
    }
  }, 1000);

  // need to get balance of this accounts (publicKey) paUSDC
  // More or less, check useAccountBalances
  // then it's pToken.balanceOf(user) + referralToken.balanceOf(user)
  // then, figure out ~ how much aUSDC will be added per second and then tick it up with Javascript

  const lendingMarketMetrics = useLendingMarketMetrics(600000);

  return (
    <SiteWrapper>
      <Confetti/>
      <Page.Content title="💰 Your Earnings">
        <div >
          <Grid.Row>
              <Grid.Col width={3}></Grid.Col>
              <Grid.Col width={3}>
                    <div className="d-flex align-items-sm-center justify-content-sm-center">
                      <div>
                          <h2>Deposited:</h2>
                          <h2>Total:</h2>
                      </div>
                    </div>
                  </Grid.Col>
                  <Grid.Col width={3}>
                    <div className="d-flex align-items-sm-center justify-content-sm-center">
                      <div>
                        <NumberFormat 
                          value={balance} 
                          displayType={'text'} 
                          thousandSeparator={true} 
                          prefix={'$'} 
                          decimalScale={4}
                          renderText={value => 
                            <h2>{value}</h2>} 
                        />
                        <NumberFormat 
                          value={balance + interest} 
                          displayType={'text'} 
                          thousandSeparator={true} 
                          prefix={'$'} 
                          decimalScale={7}
                          renderText={value => 
                            <h2>{value}</h2>} 
                        />
                      </div>
                    </div>
                </Grid.Col>
              <Grid.Col width={3}></Grid.Col>
            </Grid.Row>
        </div>
      </Page.Content>

      <Page.Content title="🤔 DeFi?">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            <Card className="mb-1">
              <Card.Header>
                <Card.Title>What's going on?</Card.Title>
              </Card.Header> 
              <Card.Body>
                <Grid.Row>
                  <Grid.Col width={12}>
                    
                  </Grid.Col>
                </Grid.Row>
              </Card.Body>
             </Card>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>

      
      
    </SiteWrapper>
  )
}

export default YourEarningsSimple;