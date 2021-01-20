// @flow

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Link
} from "react-router-dom";
import { ethers } from "ethers";

import {
  Page,
  Grid,
  Button,
  Dimmer
} from "tabler-react";

import ProtektDepositCard from "../components/ProtektDepositCard";
import SiteWrapper from "../SiteWrapper.react";
import { useUserAddress } from "eth-hooks";

import { useTokenPrice, useContractReader, useContractLoader } from "../hooks";
import {Web3Context} from '../App.react';
import { default as protektData } from "../data";

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

function SafeYield() {
  const [lendingMarketMetrics, setLendingMarketMetrics] = useState([])
  const [protektStats, setProtektStats] = useState({
    protektData
  })

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



  const pTokenBalance = useContractReader(contracts,"pToken", "balanceOf", ["0xdf1b1c58fc59cbce9e11c37ad239b37cf56e7a5a"])
  // console.log('pTokenBalance', pTokenBalance)


  // console.log('Token Prices', tokenPrices)
  if(pTokenBalance) {
    // console.log('pTokenPrice', ethers.utils.formatUnits(pTokenBalance, 8))
    // console.log('pTokenPrice', pTokenBalance.mul(ethers.BigNumber.from(.02)))

  }
  useEffect(() => {
    async function calculationStats() {
      //

      let stats = {
        price: tokenPrices,
        coveragePercentage: 0, // bal * price / bal * price
        coverageFee: 0,
        underlyingAPR: 0,
        netAdjustedAPR: 0,
      }
      // try {
      //   const response = await axios.get('https://api.defiscore.io/earn/opportunities');
      //   let temp = [response.data.data[0], response.data.data[16]]
      //   setLendingMarketMetrics(temp);
      // } catch (error) {
      //   console.error(error);
      // }
      setProtektStats(stats)
    }
    calculationStats()
  }, [tokenPrices]);



  return (
    <SiteWrapper>
      <Page.Content title="🏦 Earn Safe Yield">
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

export default SafeYield;
