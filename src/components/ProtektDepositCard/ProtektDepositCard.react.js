// @flow

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { ethers } from "ethers";

import {
  Grid,
  Header,
  Dimmer
} from "tabler-react";

import Card from "../tablerReactAlt/src/components/Card";
import DepositWithdrawTokensForm from "../DepositWithdrawTokensForm";

import { useGasPrice } from "../../hooks";
import { Transactor } from "../../utils";
import {Web3Context} from '../../App.react';

type Props = {|
  +children?: React.Node,
  +item?: Object,
  +lendingMarketMetrics?: Object,
  +tokenPrices?: Object,
  +contracts?: Object,
|};

function ProtektDepositCard({
  children,
  item,
  lendingMarketMetrics,
  tokenPrices,
  contracts,
}: Props): React.Node {
  const [loading, setLoading] = useState(true)
  const web3Context = useContext(Web3Context);
  const gasPrice = useGasPrice("fast");
  let tempBalances = {};
  tempBalances[item.underlyingTokenSymbol] = {
    token: 0,
    usd: 0
  };
  tempBalances[item.pTokenSymbol] = {
    token: 0,
    usd: 0
  };
  tempBalances[item.reserveTokenSymbol] = {
    token: 0,
    usd: 0
  };
  tempBalances[item.shieldTokenSymbol] = {
    token: 0,
    usd: 0
  };
  const [accountBalances, setAccountBalances] = useState(tempBalances)
  const [coverage, setCoverage] = useState({
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
  const lendingMarket = lendingMarketMetrics[0];

  // console.log(item)
  // console.log(lendingMarketMetrics)
  // console.log(tokenPrices)
  // console.log(contracts)

  async function handleTxSuccess() {
    console.log('Successful callback')
    let prevAccountBalances = accountBalances;

      // console.log('Prev bals');
      // console.log(prevAccountBalances);

    setTimeout(async () => {
      let temp = await getAccountBalances(item, tokenPrices, contracts);
      setAccountBalances(temp)

      // console.log('New bals');
      // console.log(temp);

    }, 5000);
  }

  async function handleDepositTx(amount) {
    if(web3Context.ready && amount > 0) {
      const tx = Transactor(web3Context.provider, handleTxSuccess, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.underlyingTokenDecimals);
      const allowanceAmount = await contracts[item.underlyingTokenSymbol]["allowance"](...[web3Context.address, item.pTokenAddress]);

      if(weiAmount.gt(allowanceAmount)) {
        tx(contracts[item.underlyingTokenSymbol]["approve"](item.pTokenAddress, ethers.utils.parseUnits('1000000',item.underlyingTokenDecimals)));
      } else {
        tx(contracts.pToken.deposit(weiAmount));
      }
    }
  }

  async function handleWithdrawTx(amount) {
    if(web3Context.ready && amount > 0) {
      const tx = Transactor(web3Context.provider, handleTxSuccess, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.pTokenDecimals);
      tx(contracts.pToken.withdraw(weiAmount));
    }
  }

  async function getAccountBalances(item, tokenPrices, contracts) {
    let balances = accountBalances;
    if(web3Context.ready && web3Context.address && contracts) {
      try {
        const underlyingTokenBalance = await contracts[item.underlyingTokenSymbol]["balanceOf"](...[web3Context.address]);
        const underlyingAllowanceAmount = await contracts[item.underlyingTokenSymbol]["allowance"](...[web3Context.address, item.pTokenAddress]);
        const pTokenBalance = await contracts["pToken"]["balanceOf"](...[web3Context.address]);

        const reserveTokenBalance = await contracts[item.reserveTokenSymbol]["balanceOf"](...[web3Context.address]);
        const reserveAllowanceAmount = await contracts[item.reserveTokenSymbol]["allowance"](...[web3Context.address, item.shieldTokenAddress]);
        const shieldTokenBalance = await contracts["shieldToken"]["balanceOf"](...[web3Context.address]);

        // console.log('-------')
        // console.log('underlying',underlyingTokenBalance.toString())
        // console.log('ptoken',pTokenBalance.toString())

        balances[item.underlyingTokenSymbol] = {
          token: underlyingTokenBalance.toString(),
          usd: 0,
          allowance: underlyingAllowanceAmount
        };
        balances[item.pTokenSymbol] = {
          token: pTokenBalance.toString(),
          usd: 0
        };
        balances[item.reserveTokenSymbol] = {
          token: reserveTokenBalance.toString(),
          usd: 0,
          allowance: reserveAllowanceAmount
        };
        balances[item.shieldTokenSymbol] = {
          token: shieldTokenBalance.toString(),
          usd: 0
        };
      } catch (error) {
        console.error(error);
      }
    }
    return balances;  
  }

  useEffect(() => {
    const getBals = async () => {
      let temp = await getAccountBalances(item, tokenPrices, contracts)
      setAccountBalances(temp)
    }
    getBals();
  }, [contracts, web3Context.address]);
  

  useEffect(() => {
    async function calcCoveragePercentage(item, tokenPrices, contracts) {
      let tempCoverage = coverage;
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
      }
      setCoverage(tempCoverage)
      setLoading(false)
    }
    calcCoveragePercentage(item, tokenPrices, contracts)
  }, [contracts, tokenPrices, lendingMarket]);

  return loading ? <Dimmer active loader /> : (
    <Card
      isCollapsible
      title= {(
        <Card.Title>
          { `Earn ${numeral(coverage.netAdjustedAPR).format('0.00')}% APR on ${item.underlyingTokenSymbol.toUpperCase()} with ${lendingMarket.protocol.toUpperCase()}` }
        </Card.Title>
      )}
    >
      <Card.Status color={(item.underlyingProtocol === 'compound') ? 'teal' : 'purple'} side />
      <Card.Body>
        <Grid.Row>
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`COST`}</h5>
            <p>{`${numeral(coverage.coverageFeeAPR).format('0.00')}% for ${coverage.coverageRatioDisplay} coverage`}</p>
            <h5 className="m-0 text-muted">{`BACKED BY`}</h5>
            <p>{`${item.backedByDisplay}`}</p>
          </Grid.Col>
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`CLAIMS`}</h5>
            <p>{`${item.claimsManagerDisplay}`}</p>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={12}>
            <h5 className="m-0 text-muted">{`COVERAGE FOR`}</h5>
            <p>{`${item.coverageDisplay}`}</p>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Body>
        <Grid.Row>
          <Grid.Col width={5} >
            <Header.H4>
              Start earning safely
            </Header.H4>
            <DepositWithdrawTokensForm
              item={item}
              accountBalances={accountBalances}
              web3Context={web3Context}
              tokenPrices={tokenPrices}
              contracts={contracts}
              handleSubmit={handleDepositTx}
              label={`Your wallet: ${numeral(ethers.utils.formatUnits(accountBalances[item.underlyingTokenSymbol]["token"],item.underlyingTokenDecimals)).format('0.00')} ${item.underlyingTokenSymbol.toUpperCase()}`}
              buttonIcon={ accountBalances[item.underlyingTokenSymbol] && 
                            accountBalances[item.underlyingTokenSymbol]["allowance"] &&
                              accountBalances[item.underlyingTokenSymbol]["allowance"].gt(0) ?
                                "download" : 
                                  "toggle-left"
                        }
              buttonLabel={ accountBalances[item.underlyingTokenSymbol] && 
                        accountBalances[item.underlyingTokenSymbol]["allowance"] &&
                          accountBalances[item.underlyingTokenSymbol]["allowance"].gt(0) ?
                            "Deposit" : 
                              "Approve"
                    }
            />
          </Grid.Col>
          <Grid.Col width={5} offset={1}>
            <Header.H4>
              Withdraw anytime
            </Header.H4>
            <DepositWithdrawTokensForm
              item={item}
              accountBalances={accountBalances}
              web3Context={web3Context}
              tokenPrices={tokenPrices}
              contracts={contracts}
              handleSubmit={handleWithdrawTx}
              label={`Your deposits: ${numeral(ethers.utils.formatUnits(accountBalances[item.pTokenSymbol]["token"],item.pTokenDecimals)).format('0.00')} ${item.pTokenSymbol}`}
              buttonIcon={ "upload" }
              buttonLabel={ "Withdraw" }
            />
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
    </Card>
  )
}

/** @component */
export default ProtektDepositCard;
