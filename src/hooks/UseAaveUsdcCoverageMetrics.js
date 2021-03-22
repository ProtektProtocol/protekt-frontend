import { useState, useEffect } from "react";
import axios from 'axios';
import _ from 'lodash';
import numeral from 'numeral';
import { ethers } from "ethers";
import { usePoller } from "eth-hooks";
import {  v2 } from '@aave/protocol-js';

import { AAVE_SUBGRAPH_URL } from "../config/index"
import BigNumber from "bignumber.js";


import Web3 from "web3";

import { INFURA_LINK, AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS} from "../config";

const aaveDataProviderAbi = [{"inputs":[{"internalType":"contract ILendingPoolAddressesProvider","name":"addressesProvider","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ADDRESSES_PROVIDER","outputs":[{"internalType":"contract ILendingPoolAddressesProvider","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllATokens","outputs":[{"components":[{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"tokenAddress","type":"address"}],"internalType":"struct AaveProtocolDataProvider.TokenData[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllReservesTokens","outputs":[{"components":[{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"tokenAddress","type":"address"}],"internalType":"struct AaveProtocolDataProvider.TokenData[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveConfigurationData","outputs":[{"internalType":"uint256","name":"decimals","type":"uint256"},{"internalType":"uint256","name":"ltv","type":"uint256"},{"internalType":"uint256","name":"liquidationThreshold","type":"uint256"},{"internalType":"uint256","name":"liquidationBonus","type":"uint256"},{"internalType":"uint256","name":"reserveFactor","type":"uint256"},{"internalType":"bool","name":"usageAsCollateralEnabled","type":"bool"},{"internalType":"bool","name":"borrowingEnabled","type":"bool"},{"internalType":"bool","name":"stableBorrowRateEnabled","type":"bool"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"isFrozen","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveData","outputs":[{"internalType":"uint256","name":"availableLiquidity","type":"uint256"},{"internalType":"uint256","name":"totalStableDebt","type":"uint256"},{"internalType":"uint256","name":"totalVariableDebt","type":"uint256"},{"internalType":"uint256","name":"liquidityRate","type":"uint256"},{"internalType":"uint256","name":"variableBorrowRate","type":"uint256"},{"internalType":"uint256","name":"stableBorrowRate","type":"uint256"},{"internalType":"uint256","name":"averageStableBorrowRate","type":"uint256"},{"internalType":"uint256","name":"liquidityIndex","type":"uint256"},{"internalType":"uint256","name":"variableBorrowIndex","type":"uint256"},{"internalType":"uint40","name":"lastUpdateTimestamp","type":"uint40"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"}],"name":"getReserveTokensAddresses","outputs":[{"internalType":"address","name":"aTokenAddress","type":"address"},{"internalType":"address","name":"stableDebtTokenAddress","type":"address"},{"internalType":"address","name":"variableDebtTokenAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"address","name":"user","type":"address"}],"name":"getUserReserveData","outputs":[{"internalType":"uint256","name":"currentATokenBalance","type":"uint256"},{"internalType":"uint256","name":"currentStableDebt","type":"uint256"},{"internalType":"uint256","name":"currentVariableDebt","type":"uint256"},{"internalType":"uint256","name":"principalStableDebt","type":"uint256"},{"internalType":"uint256","name":"scaledVariableDebt","type":"uint256"},{"internalType":"uint256","name":"stableBorrowRate","type":"uint256"},{"internalType":"uint256","name":"liquidityRate","type":"uint256"},{"internalType":"uint40","name":"stableRateLastUpdated","type":"uint40"},{"internalType":"bool","name":"usageAsCollateralEnabled","type":"bool"}],"stateMutability":"view","type":"function"}]
const SECONDS_PER_YEAR = BigNumber('31536000');


/** 
    @dev Note when testing below
    - it will always fail on kovan below as aave api wont support kovan aUSDC
    - swap out item.underlyingTokenAddress for - 0xbcca60bb61934080951369a648fb03df4f96263c
    - this will be MAINNET not KOVAN I.R.

    - API is unreliable - switch out for this method for one of two fallbacks seen in try catch
    - don't know why top one wont work -  getProtocolDataFromTheGraph(item) 
    - second one unfin - getProtocolAPRFallack(address)
**/
async function getProtocolAPR(item) {
  let apr = 0;
   try {
     const response = await axios.get(`https://aave-api-v2.aave.com/data/liquidity/v2?poolId=0xb53c1a33016b2dc2ff3653530bff1848a515c8c5`);
     for(let element of response.data){
       if(element['aTokenAddress'] === item.underlyingTokenAddress){ // - 0xbcca60bb61934080951369a648fb03df4f96263c
         apr = element['avg91DaysLiquidityRate'] // which rate to use here?
       }
     }
   } catch (error) {
     console.error(error);
     try{
       // apr = await getProtocolDataFromTheGraph(item) - DOESNT WORK ?
       // apr = await getProtocolAPRFallack(address) - don't know what to do with liquidityRate here?
     }catch(secondError){
       console.error(secondError)
     }
   }

  return apr;
}

async function getProtocolDataFromTheGraph(contract){
  let response = await fetch(AAVE_SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `
      query GET_RESERVE_DATA {
        reserves (where: {
          usageAsCollateralEnabled: true
        }) {
          id
          name
          decimals
          price {
            id
          }
          borrowingEnabled
          stableBorrowRateEnabled
          baseLTVasCollateral
          optimalUtilisationRate
          averageStableRate
          stableRateSlope1
          stableRateSlope2
          baseVariableBorrowRate
          variableRateSlope1
          variableRateSlope2
          variableBorrowIndex
          variableBorrowRate
          totalScaledVariableDebt
          liquidityIndex
          reserveLiquidationThreshold
          aToken {
            id
          }
          vToken {
            id
          }
          sToken {
            id
          }
          availableLiquidity
          stableBorrowRate
          liquidityRate
          totalPrincipalStableDebt
          totalLiquidity
          utilizationRate
          reserveLiquidationBonus
          price {
            priceInEth
          }
          lastUpdateTimestamp
          stableDebtLastUpdateTimestamp
          reserveFactor
        }
      }`
    }),
  })
  response = await response.json()
  let reserves = response.data.reserves
  let filteredReserves = reserves.filter(item => item.price.id.toLowerCase() === contract.coreTokenAddress.toLowerCase()).filter(item => item.liquidityRate != "0")
  let formattedV2 = v2.formatReserves(filteredReserves,Math.trunc(new Date().getTime()/1000)).filter(item => item.aToken.id.toLowerCase() === contract.underlyingTokenAddress.toLowerCase())

  let utilizationRate = BigNumber(formattedV2[0].utilizationRate)
  let shareStableBorrows = BigNumber(formattedV2[0].totalStableDebt).div(BigNumber(formattedV2[0].totalDebt)) 
  let averageStableRate = BigNumber(formattedV2[0].averageStableRate)
  let shareOfVariableBorrows = BigNumber(formattedV2[0].totalVariableDebt).div(BigNumber(formattedV2[0].totalDebt)) 
  let variableBorrowRate = BigNumber(formattedV2[0].variableBorrowRate)
  let reserveFactor = BigNumber(formattedV2[0].reserveFactor)

  return calculateAaveDepositAPY(
    utilizationRate,
    shareStableBorrows,
    averageStableRate,
    shareOfVariableBorrows,
    variableBorrowRate, 
    reserveFactor
  )
  return 0
}


/*
    From documentation at bottom of page

    - https://docs.aave.com/risk/liquidity-risk/borrow-interest-rate
*/
function calculateAaveDepositAPY(
  utilizationRate,
  shareStableBorrows,
  averageStableRate,
  shareOfVariableBorrows,
  variableBorrowRate, 
  reserveFactor
){
  
  let depositAPY = utilizationRate.times(shareStableBorrows.times(averageStableRate).plus(shareOfVariableBorrows.times(variableBorrowRate))).times(BigNumber(1).minus(reserveFactor))
  return depositAPY
}

/*
    Fallback for when Aave API doesnt work
    - call contract directly 
*/
async function getProtocolAPRFallack(address){
  console.log(`address : ${address}`)
  let apr = 0
  const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_LINK));
  try{
    let aaveDataProviderContract = new web3.eth.Contract(aaveDataProviderAbi,AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS);
    const reserveData = await aaveDataProviderContract.methods.getReserveData(address).call();
    console.log('reserve data is...')
    console.log(reserveData)
    /*  
        Need to do something with this liquidityRate
        - https://docs.aave.com/developers/the-core-protocol/protocol-data-provider
        - it says it should be the intetest rate for deposits
        - but value returns far too large...
    */
   return 0
  }catch(e){
    console.log(e)
    return e
  }
  return apr
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
  _coverage.protocolAPR = await getProtocolAPR(item);

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
    async function run() {
      const data = await getAaveUsdcCoverageMetrics(
        item,
        contracts,
        tokenPrices,
        lendingMarket
      );
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
