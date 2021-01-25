import { useState, useEffect } from "react";
import usePoller from "./Poller";
import axios from 'axios';
import { ethers } from "ethers";

export default function useCompoundDaiCoverageMetrics(provider, item, contracts, tokenPrices, lendingMarket, pollTime) {
  const [coverageMetrics, setCoverageMetrics] = useState({
    pTokenTotalDepositTokens: 0,
    pTokenTotalDepositUsd: 0,
    shieldTokenTotalDepositTokens: 0,
    shieldTokenTotalDepositUsd: 0,
    coverageRatio: 100,
    coverageRatioDisplay: '100%',
    coverageFeeAPR: item.maxBlockFeeAPR,
    tempCoverage: 0,
    netAdjustedAPR: (lendingMarket ? lendingMarket.apr : 5) - item.maxBlockFeeAPR
  });

  useEffect(() => {
    const getMetrics = async () => {
      let tempCoverage = coverageMetrics;
      let compAPR = 0;

      try {
        const response = await axios.get('https://api.compound.finance/api/v2/ctoken?meta=true&network=mainnet');

        let temp = response.data.cToken.filter(function (e) {
          let symbol = item.underlyingTokenSymbol;
          if(symbol === 'cdai') {
            symbol = 'cDAI'
          }
          return e.symbol === symbol;
        });

        compAPR = temp[0].comp_supply_apy.value
      } catch (error) {
        console.error(error);
      }

      if(contracts && tokenPrices && lendingMarket) {
        try {
          tempCoverage.pTokenTotalDepositTokens = await contracts[item.underlyingTokenSymbol]["balanceOf"](...[item.pTokenAddress]);
          tempCoverage.pTokenTotalDepositUsd = parseFloat(ethers.utils.formatUnits(tempCoverage.pTokenTotalDepositTokens,item.pTokenDecimals)) * tokenPrices[item.underlyingTokenSymbol]['usd'];
          tempCoverage.shieldTokenTotalDepositTokens = await contracts[item.reserveTokenSymbol]["balanceOf"](...[item.shieldTokenAddress]);
          tempCoverage.shieldTokenTotalDepositUsd = parseFloat(ethers.utils.formatUnits(tempCoverage.shieldTokenTotalDepositTokens,item.shieldTokenDecimals)) * tokenPrices[item.reserveTokenSymbol]['usd'];
          tempCoverage.coverageRatio = tempCoverage.shieldTokenTotalDepositUsd / tempCoverage.pTokenTotalDepositUsd;
          tempCoverage.coverageRatioDisplay = tempCoverage.coverageRatio > 1 ? '100%' : `numeral(tempCoverage.coverageRatio * 100).format('0.00')}%`;
          tempCoverage.coverageFeeAPR = tempCoverage.coverageRatio > 1 ? item.maxBlockFeeAPR : item.maxBlockFeeAPR / tempCoverage.coverageRatio;
          tempCoverage.compAPR = compAPR;
          tempCoverage.netAdjustedAPR = parseFloat(lendingMarket.apr) + parseFloat(tempCoverage.compAPR) - parseFloat(tempCoverage.coverageFeeAPR);

          // console.log('----Coverage----')
          // console.log('pTokens',tempCoverage.pTokenTotalDepositTokens.toString())
          // console.log('Price',tempCoverage.pTokenTotalDepositUsd)
          // console.log('shieldTokens',tempCoverage.shieldTokenTotalDepositTokens.toString())
          // console.log('Price',tempCoverage.shieldTokenTotalDepositUsd)
          // console.log('Coverage',tempCoverage.coverageRatio)
          // console.log('Supply APR',lendingMarket.apr)
          // console.log('compAPR',tempCoverage.compAPR)
          // console.log('CoverageFee',tempCoverage.coverageFeeAPR)
          // console.log('Adjusted APR',tempCoverage.netAdjustedAPR)

        } catch (error) {
          console.error(error);
        }
        setCoverageMetrics(tempCoverage);
      }
    };
    getMetrics();
  }, [provider, tokenPrices, lendingMarket]);
  return coverageMetrics;
}