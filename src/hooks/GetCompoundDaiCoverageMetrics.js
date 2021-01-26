import { useState, useEffect } from "react";
import axios from 'axios';
import { ethers } from "ethers";

// export default function useCompoundDaiCoverageMetrics(provider, item, contracts, tokenPrices, lendingMarket, pollTime) {
//   const [coverageMetrics, setCoverageMetrics] = useState({
//     loading: true,
//     pTokenTotalDepositTokens: 0,
//     pTokenTotalDepositUsd: 0,
//     shieldTokenTotalDepositTokens: 0,
//     shieldTokenTotalDepositUsd: 0,
//     coverageRatio: 100,
//     coverageRatioDisplay: '100%',
//     coverageFeeAPR: item.maxBlockFeeAPR,
//     tempCoverage: 0,
//     compAPR: 0,
//     netAdjustedAPR: (lendingMarket ? lendingMarket.apr : 5) - item.maxBlockFeeAPR
//   });

//   useEffect(() => {
//     const getMetrics = async () => {
//       let tempCoverage = coverageMetrics;
//       let compAPR = 0;

//       try {
//         const response = await axios.get('https://api.compound.finance/api/v2/ctoken?meta=true&network=mainnet');

//         let temp = response.data.cToken.filter(function (e) {
//           let symbol = item.underlyingTokenSymbol;
//           if(symbol === 'cdai') {
//             symbol = 'cDAI'
//           }
//           return e.symbol === symbol;
//         });

//         compAPR = temp[0].comp_supply_apy.value
//       } catch (error) {
//         console.error(error);
//       }

//       if(contracts && tokenPrices && lendingMarket) {
//         try {
//           tempCoverage.loading = false;
//           tempCoverage.pTokenTotalDepositTokens = await contracts[item.underlyingTokenSymbol]["balanceOf"](...[item.pTokenAddress]);
//           tempCoverage.pTokenTotalDepositUsd = parseFloat(ethers.utils.formatUnits(tempCoverage.pTokenTotalDepositTokens,item.pTokenDecimals)) * tokenPrices[item.underlyingTokenSymbol]['usd'];
//           tempCoverage.shieldTokenTotalDepositTokens = await contracts[item.reserveTokenSymbol]["balanceOf"](...[item.shieldTokenAddress]);
//           tempCoverage.shieldTokenTotalDepositUsd = parseFloat(ethers.utils.formatUnits(tempCoverage.shieldTokenTotalDepositTokens,item.shieldTokenDecimals)) * tokenPrices[item.reserveTokenSymbol]['usd'];
//           tempCoverage.coverageRatio = tempCoverage.shieldTokenTotalDepositUsd / tempCoverage.pTokenTotalDepositUsd;
//           tempCoverage.coverageRatioDisplay = tempCoverage.coverageRatio > 1 ? '100%' : `numeral(tempCoverage.coverageRatio * 100).format('0.00')}%`;
//           tempCoverage.coverageFeeAPR = tempCoverage.coverageRatio > 1 ? item.maxBlockFeeAPR : item.maxBlockFeeAPR / tempCoverage.coverageRatio;
//           tempCoverage.compAPR = compAPR;
//           tempCoverage.netAdjustedAPR = parseFloat(lendingMarket.apr) + parseFloat(tempCoverage.compAPR) - parseFloat(tempCoverage.coverageFeeAPR);

//           // console.log('----Coverage----')
//           // console.log('pTokens',tempCoverage.pTokenTotalDepositTokens.toString())
//           // console.log('Price',tempCoverage.pTokenTotalDepositUsd)
//           // console.log('shieldTokens',tempCoverage.shieldTokenTotalDepositTokens.toString())
//           // console.log('Price',tempCoverage.shieldTokenTotalDepositUsd)
//           // console.log('Coverage',tempCoverage.coverageRatio)
//           // console.log('Supply APR',lendingMarket.apr)
//           // console.log('compAPR',tempCoverage.compAPR)
//           // console.log('CoverageFee',tempCoverage.coverageFeeAPR)
//           // console.log('Adjusted APR',tempCoverage.netAdjustedAPR)

//         } catch (error) {
//           console.error(error);
//         }
//         console.log(tempCoverage)
//         setCoverageMetrics(tempCoverage);
//       }
//     };
//     getMetrics();
//   }, [provider, contracts, tokenPrices, lendingMarket]);
//   return coverageMetrics;
// }

export default async function getCompoundDaiCoverageMetrics(item, contracts, tokenPrices, lendingMarket) {
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
    compAPR: 0,
    netAdjustedAPR: (lendingMarket ? lendingMarket.apr : 5) - item.maxBlockFeeAPR
  };

  try {
    const response = await axios.get('https://api.compound.finance/api/v2/ctoken?meta=true&network=mainnet');

    let temp = response.data.cToken.filter(function (e) {
      let symbol = item.underlyingTokenSymbol;
      if(symbol === 'cdai') {
        symbol = 'cDAI'
      }
      return e.symbol === symbol;
    });

    _coverage.compAPR = temp[0].comp_supply_apy.value
  } catch (error) {
    console.error(error);
  }

  if(contracts && tokenPrices && lendingMarket) {
    try {
      _coverage.pTokenTotalDepositTokens = await contracts[item.underlyingTokenSymbol]["balanceOf"](...[item.pTokenAddress]);
      _coverage.pTokenTotalDepositUsd = parseFloat(ethers.utils.formatUnits(_coverage.pTokenTotalDepositTokens,item.pTokenDecimals)) * tokenPrices[item.underlyingTokenSymbol]['usd'];
      _coverage.shieldTokenTotalDepositTokens = await contracts[item.reserveTokenSymbol]["balanceOf"](...[item.shieldTokenAddress]);
      _coverage.shieldTokenTotalDepositUsd = parseFloat(ethers.utils.formatUnits(_coverage.shieldTokenTotalDepositTokens,item.shieldTokenDecimals)) * tokenPrices[item.reserveTokenSymbol]['usd'];
      _coverage.coverageRatio = _coverage.shieldTokenTotalDepositUsd / _coverage.pTokenTotalDepositUsd;
      _coverage.coverageRatioDisplay = _coverage.coverageRatio > 1 ? '100%' : `numeral(_coverage.coverageRatio * 100).format('0.00')}%`;
      _coverage.coverageFeeAPR = _coverage.coverageRatio > 1 ? item.maxBlockFeeAPR : item.maxBlockFeeAPR / _coverage.coverageRatio;
      _coverage.netAdjustedAPR = parseFloat(lendingMarket.apr) + parseFloat(_coverage.compAPR) - parseFloat(_coverage.coverageFeeAPR);
      _coverage.loading = false;
      // console.log('----Coverage----')
      // console.log('pTokens',_coverage.pTokenTotalDepositTokens.toString())
      // console.log('Price',_coverage.pTokenTotalDepositUsd)
      // console.log('shieldTokens',_coverage.shieldTokenTotalDepositTokens.toString())
      // console.log('Price',_coverage.shieldTokenTotalDepositUsd)
      // console.log('Coverage',_coverage.coverageRatio)
      // console.log('Supply APR',lendingMarket.apr)
      // console.log('compAPR',_coverage.compAPR)
      // console.log('CoverageFee',_coverage.coverageFeeAPR)
      // console.log('Adjusted APR',_coverage.netAdjustedAPR)

    } catch (error) {
      console.error(error);
    }
    // console.log(_coverage)
  }
  return _coverage
}