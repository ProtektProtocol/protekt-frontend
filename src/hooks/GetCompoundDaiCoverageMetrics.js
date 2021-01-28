import { useState, useEffect } from "react";
import axios from 'axios';
import _ from 'lodash';
import numeral from 'numeral';
import { ethers } from "ethers";

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
    protocolAPR: 0,
    netAdjustedAPR: (lendingMarket ? lendingMarket.apr : 5) - item.maxBlockFeeAPR
  };

  try {
    const response = await axios.get('https://api.compound.finance/api/v2/ctoken?meta=true&network=mainnet');

    let temp = response.data.cToken.filter(function (e) {
      let symbol = item.underlyingTokenSymbol;
      if(symbol === 'cdai') {
        symbol = 'cDAI'
      } else if(symbol === 'cusdc') {
        symbol = 'cUSDC'
      }
      return e.symbol === symbol;
    });

    _coverage.protocolAPR = temp[0].comp_supply_apy.value
  } catch (error) {
    console.error(error);
  }

  if(contracts && !_.isEmpty(tokenPrices) && lendingMarket) {
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
    // console.log(_coverage)
  }
  return _coverage
}