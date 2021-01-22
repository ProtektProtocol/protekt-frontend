// @flow

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import {
  Page,
  Grid,
  Dimmer
} from "tabler-react";

import StakingDepositCard from "../components/StakingDepositCard";
import SiteWrapper from "../SiteWrapper.react";

import { useTokenPrice, useContractReader, useContractLoader } from "../hooks";
import {Web3Context} from '../App.react';
import { default as protektData } from "../data";

function returnCards(items=[], lendingMarketMetrics, tokenPrices, contracts) {
  return items.map((item, key) => {
    return (
      <StakingDepositCard
        key={key}
        item={item}
        lendingMarketMetrics={lendingMarketMetrics}
        tokenPrices={tokenPrices}
        contracts={contracts}
      />
    )
  })
}

function Staking() {
  const [lendingMarketMetrics, setLendingMarketMetrics] = useState([])

  useEffect(() => {
    async function getLendingMarketMetrics() {
      try {
        const response = await axios.get('https://api.defiscore.io/earn/opportunities');
        // console.log("response",response)
        let temp = [response.data.data[0], response.data.data[16]]
        setLendingMarketMetrics(temp);
      } catch (error) {
        console.error(error);
      }
    }
    getLendingMarketMetrics()
  }, []);

  const web3Context = useContext(Web3Context);
  const tokenPrices = useTokenPrice(web3Context.provider, 'DAI,cDAI,WETH', 600000);
  const contracts = useContractLoader(web3Context.provider);

  return (
    <SiteWrapper>
      <Page.Content title="🛡 Stake to Shield Mine">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            { !lendingMarketMetrics.length ? <Dimmer active loader /> : 
              returnCards(protektData.protektContracts, lendingMarketMetrics, tokenPrices, contracts)
            }
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default Staking;