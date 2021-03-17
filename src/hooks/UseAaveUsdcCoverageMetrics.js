import { useState, useEffect } from "react";
import axios from 'axios';
import _ from 'lodash';
import numeral from 'numeral';
import { ethers } from "ethers";
import { usePoller } from "eth-hooks";

import BN from "bn.js"

// aave constants
const SECONDS_PER_YEAR = new BN('31536000');



async function getProtocolAPR() {
  let apr = 0;
  try {
    const response = await axios.get(`https://aave-api-v2.aave.com/data/liquidity/v2?poolId=0xb53c1a33016b2dc2ff3653530bff1848a515c8c5`);

    console.log('logging response in getProtocolAPR')
    console.log(response)

    for(let element of response.data){
      if(element['aTokenAddress'] === "0xbcca60bb61934080951369a648fb03df4f96263c"){
        apr = element['avg91DaysLiquidityRate']
        console.log(`got apr: ${apr}`)
      }
    }
  } catch (error) {
    console.error(error);
    try{
      apr = await getProtocolAPRFallack()
    }catch(secondError){
      console.error(secondError)
    }
  }
  return apr;
}

async function getProtocolAPRFallack(){
  let aaveData = await fetchAaveSubgraphData("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")
  console.log('logging aave data')
  console.log(aaveData.reserves)
  console.log(aaveData.reserves[0].liquidityIndex)

  let archivedRate = calculateAverageRate(
    aaveData.reserves[0].liquidityIndex,
    aaveData.reserves[0].paramsHistory[0].liquidityIndex,
    aaveData.reserves[0].paramsHistory[0].timestamp,
    aaveData.reserves[0].lastUpdateTimestamp
  );

  console.log('archived rate:')
  console.log(archivedRate)

  return archivedRate
}

async function fetchAaveSubgraphData(tokenId){
  let response = await fetch("https://api.thegraph.com/subgraphs/name/aave/protocol", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `
      query GET_DATA {
        reserves(first: 1, where: {id: "${tokenId}"} ) {
          id
          lastUpdateTimestamp
          liquidityIndex
          variableBorrowIndex
          paramsHistory(first: 1, orderDirection: asc, orderBy: timestamp){
            timestamp
            liquidityIndex
            variableBorrowIndex
          }
        }
      }`
    }),
  })
  response = await response.json()
  return response.data
}

function calculateAverageRate(index0, index1, timestamp0, timestamp1){

  return valueToBigNumber(index1)
  .div(index0)
  .minus('1')
  .div(timestamp1 - timestamp0)
  .times(SECONDS_PER_YEAR)
  .toString();
}

function valueToBigNumber(value){
  return new BN(value)
}


export async function getAaveUsdcCoverageMetrics(item, contracts, tokenPrices, lendingMarket) {
  let _coverage = {
    loading: true,
    pTokenTotalDepositTokens: 0,
    pTokenTotalDepositUsd: 0,
    shieldTokenTotalDepositTokens: 0,
    shieldTokenTotalDepositUsd: 0,
    coverageRatio: 100,
    coverageRatioDisplay: '100%',
    coverageFeeAPR: item.maxBlockFeeAPR,
    tempCoverage: 0,
    protocolAPR: 0,
    netAdjustedAPR: (lendingMarket ? lendingMarket.apr : 5) - item.maxBlockFeeAPR
  };

  _coverage.protocolAPR = await getProtocolAPR(item.underlyingTokenSymbol);

  console.log('logging coverage apr')
  console.log(_coverage.protocolAPR)

  if(!_.isEmpty(contracts)) {
    try {
      _coverage.pTokenTotalDepositTokens = await contracts[item.underlyingTokenSymbol]["balanceOf"](...[item.pTokenAddress]);
      _coverage.pTokenTotalDepositUsd = parseFloat(ethers.utils.formatUnits(_coverage.pTokenTotalDepositTokens,item.pTokenDecimals)) * tokenPrices[item.underlyingTokenSymbol]['usd'];
      _coverage.shieldTokenTotalDepositTokens = await contracts[item.reserveTokenSymbol]["balanceOf"](...[item.shieldTokenAddress]);
      _coverage.shieldTokenTotalDepositUsd = parseFloat(ethers.utils.formatUnits(_coverage.shieldTokenTotalDepositTokens,item.shieldTokenDecimals)) * tokenPrices[item.reserveTokenSymbol]['usd'];
      _coverage.coverageRatio = _coverage.shieldTokenTotalDepositUsd / _coverage.pTokenTotalDepositUsd;
      _coverage.coverageRatioDisplay = _coverage.coverageRatio > 1 ? '100%' : `${numeral(_coverage.coverageRatio * 100).format('0.00')}%`;
      _coverage.coverageFeeAPR = _coverage.coverageRatio > 1 ? item.maxBlockFeeAPR : item.maxBlockFeeAPR / _coverage.coverageRatio;
      _coverage.netAdjustedAPR = parseFloat(lendingMarket.apr) + parseFloat(_coverage.protocolAPR) - parseFloat(_coverage.coverageFeeAPR);
      _coverage.loading = false;
      // console.log('----Coverage----')
      // console.log('pTokens',_coverage.pTokenTotalDepositTokens.toString())
      // console.log('Price',_coverage.pTokenTotalDepositUsd)
      // console.log('shieldTokens',_coverage.shieldTokenTotalDepositTokens.toString())
      // console.log('Price',_coverage.shieldTokenTotalDepositUsd)
      // console.log('Coverage',_coverage.coverageRatio)
      // console.log('Supply APR',lendingMarket.apr)
      // console.log('protocolAPR',_coverage.protocolAPR)
      // console.log('CoverageFee',_coverage.coverageFeeAPR)
      // console.log('Adjusted APR',_coverage.netAdjustedAPR)

    } catch (error) {
      console.error(error);
    }
  }
  return _coverage
}

export function useAaveUsdcCoverageMetrics(
  item,
  contracts,
  tokenPrices,
  lendingMarket) {
  const [metrics, setMetrics] = useState({
    loading: true,
    pTokenTotalDepositTokens: 0,
    pTokenTotalDepositUsd: 0,
    shieldTokenTotalDepositTokens: 0,
    shieldTokenTotalDepositUsd: 0,
    coverageRatio: 100,
    coverageRatioDisplay: '100%',
    coverageFeeAPR: 0,
    tempCoverage: 0,
    compAPR: 0,
    netAdjustedAPR: 0
  });
  useEffect(() => {
    console.log('is aave')
    async function run() {
      const data = await getAaveUsdcCoverageMetrics(
        item,
        contracts,
        tokenPrices,
        lendingMarket
      );
      console.log('logging data')
      console.log(data)
      setMetrics(data);
    }

    if(!_.isEmpty(contracts) && !_.isEmpty(tokenPrices)) {
      run();       
    }
  },[contracts, tokenPrices]);

  return metrics;
}

export function usePolledAaveUsdcCoverageMetrics(
  item,
  contracts,
  tokenPrices,
  lendingMarket) {
  const [metrics, setMetrics] = useState({
    loading: true,
    pTokenTotalDepositTokens: 0,
    pTokenTotalDepositUsd: 0,
    shieldTokenTotalDepositTokens: 0,
    shieldTokenTotalDepositUsd: 0,
    coverageRatio: 100,
    coverageRatioDisplay: '100%',
    coverageFeeAPR: 0,
    tempCoverage: 0,
    compAPR: 0,
    netAdjustedAPR: 0
  });

  async function run() {
    if(!_.isEmpty(contracts) && !_.isEmpty(tokenPrices)) {
      const data = await getAaveUsdcCoverageMetrics(
        item,
        contracts,
        tokenPrices,
        lendingMarket
      );
      setMetrics(data);
    }
  }
  usePoller(run, 2000);

  return metrics;
}
