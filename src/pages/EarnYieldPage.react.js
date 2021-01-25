// @flow

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import {
  Page,
  Grid,
  Dimmer
} from "tabler-react";

import ProtektDepositCard from "../components/ProtektDepositCard";
import SiteWrapper from "../SiteWrapper.react";

import { useTokenPrice, useContractReader, useContractLoader, useLendingMarketMetrics } from "../hooks";
import {Web3Context} from '../App.react';
import { default as protektData } from "../data";

function EarnYield() {
  const web3Context = useContext(Web3Context);
  const contracts = useContractLoader(web3Context.provider);
  const tokenPrices = useTokenPrice(web3Context.provider, 'DAI,cDAI,WETH', 600000);
  const lendingMarketMetrics = useLendingMarketMetrics(600000);

  function returnCards(items=[], lendingMarketMetrics, tokenPrices, contracts) {
    return items.map((item, key) => {
      return (
        <ProtektDepositCard
          key={key}
          item={item}
          lendingMarketMetrics={lendingMarketMetrics}
          tokenPrices={tokenPrices}
          contracts={contracts}
        />
      )
    })
  }

  return (
    <SiteWrapper>
      <Page.Content title="🏦 Earn Safe Yield">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            { (!lendingMarketMetrics.length && tokenPrices) ? <Dimmer active loader /> : 
              returnCards(protektData.protektContracts, lendingMarketMetrics, tokenPrices, contracts)
            }
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default EarnYield;
