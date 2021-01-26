// @flow

import React, { useContext } from 'react';

import {
  Page,
  Grid,
  Dimmer
} from "tabler-react";

import StakingDepositCard from "../components/StakingDepositCard";
import SiteWrapper from "../SiteWrapper.react";

import { useTokenPrice, useContractLoader, useLendingMarketMetrics } from "../hooks";
import {Web3Context} from '../App.react';
import { default as protektData } from "../data";

function Staking() {
  const web3Context = useContext(Web3Context);
  const contracts = useContractLoader(web3Context.provider);
  const tokenPrices = useTokenPrice(web3Context.provider, 'DAI,cDAI,WETH', 600000);
  const lendingMarketMetrics = useLendingMarketMetrics(600000);

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

  return (
    <SiteWrapper>
      <Page.Content title="🛡 Stake to Shield Mine">
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

export default Staking;