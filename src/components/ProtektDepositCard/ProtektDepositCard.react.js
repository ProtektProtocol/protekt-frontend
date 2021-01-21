// @flow

import React, { useState, useEffect, useContext } from 'react';
import numeral from 'numeral';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";

import {
  Grid,
  // Card,
  Form,
  Button,
  Header,
} from "tabler-react";

import Card from "../tablerReactAlt/src/components/Card";
import DisplayToken from "../DisplayToken";
import DepositWithdrawTokensForm from "../DepositWithdrawTokensForm";

import { useGasPrice, useContractLoader } from "../../hooks";
import { useUserAddress } from "eth-hooks";
import { parseEther, formatEther } from "@ethersproject/units";
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
  const [accountBalances, setAccountBalances] = useState(tempBalances)
  const [coveragePercentage, setCoveragePercentage] = useState(100)
  const lendingMarket = lendingMarketMetrics[0];

  // console.log(item)
  // console.log(lendingMarketMetrics)
  // console.log(tokenPrices)
  // console.log(contracts)

  async function handleDepositTx(amount) {
    if(web3Context.ready && amount > 0) {
      const tx = Transactor(web3Context.provider, gasPrice);
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
      const tx = Transactor(web3Context.provider, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.pTokenDecimals);
      tx(contracts.pToken.withdraw(weiAmount));
    }
  }


  useEffect(() => {
    async function getAccountBalances(item, tokenPrices, contracts) {
      let balances = {};
      if(web3Context.ready && web3Context.address && contracts) {
        try {
          const underlyingTokenBalance = await contracts[item.underlyingTokenSymbol]["balanceOf"](...[web3Context.address]);
          const allowanceAmount = await contracts[item.underlyingTokenSymbol]["allowance"](...[web3Context.address, item.pTokenAddress]);
          const pTokenBalance = await contracts["pToken"]["balanceOf"](...[web3Context.address]);

          // console.log('-------')
          // console.log(underlyingTokenBalance.toString())
          // console.log(pTokenBalance.toString())

          balances[item.underlyingTokenSymbol] = {
            token: underlyingTokenBalance.toString(),
            usd: 0,
            allowance: allowanceAmount
          };
          balances[item.pTokenSymbol] = {
            token: pTokenBalance.toString(),
            usd: 0
          };
          setAccountBalances(balances)
        } catch (error) {
          console.error(error);
        }        
      }
    }
    getAccountBalances(item, tokenPrices, contracts)
  }, [contracts, web3Context.address]);
  

  useEffect(() => {
    async function calcCoveragePercentage(item, tokenPrices, contracts) {
      let coverage = 100;
      if(contracts) {
        try {
          const pTokenTotalDepositTokens = await contracts[item.underlyingTokenSymbol]["balanceOf"](...[item.pTokenAddress]);
          const shieldTokenTotalDepositTokens = await contracts[item.reserveTokenSymbol]["balanceOf"](...[item.shieldTokenAddress]);

          // if(shieldTokenTotalDepositTokens.lte(0)) {
          //   coverage = 0
          // } else {
          //   let ten = BigNumber.from(10);
          //   let pTokenTotalDepositUsd = pTokenTotalDepositTokens.div(ten.pow(item.underlyingTokenDecimals)).mul(tokenPrices[item.underlyingTokenSymbol]['usd']);
          //   let shieldTokenTotalDepositUsd = shieldTokenTotalDepositTokens.div(ten.pow(item.reserveTokenDecimals)).mul(tokenPrices[item.reserveTokenSymbol]['usd']);
          //   console.log('-------')
          //   console.log(pTokenTotalDepositUsd)
          //   console.log(shieldTokenTotalDepositUsd)
          //   converage = pTokenTotalDepositUsd.div(shieldTokenTotalDepositUsd).mul(100);
          // }
        } catch (error) {
          console.error(error);
        }
      }
      setCoveragePercentage(coverage)
    }
    calcCoveragePercentage(item, tokenPrices, contracts)
  }, [contracts]);

  const coverageFeeAPR = item.maxBlockFeeAPR * coveragePercentage
  const netAdjustedAPR = lendingMarket.apr - coverageFeeAPR

  if(accountBalances[item.underlyingTokenSymbol] && 
                                accountBalances[item.underlyingTokenSymbol]["allowance"] &&
                                  accountBalances[item.underlyingTokenSymbol]["allowance"].gt(0)) {

  console.log(accountBalances[item.underlyingTokenSymbol]["allowance"])
  console.log(accountBalances[item.underlyingTokenSymbol]["allowance"].toString())
  console.log(accountBalances[item.underlyingTokenSymbol]["allowance"].gt(0))    
  }


  return (
    <Card
      isCollapsible
      title= {(
        <Card.Title>
          { `Earn ${numeral(netAdjustedAPR).format('0.00')}% APR on ${lendingMarket.token.toUpperCase()} with ${lendingMarket.protocol.toUpperCase()}` }
        </Card.Title>
      )}
    >
      <Card.Status color={(item.underlyingProtocol === 'compound') ? 'teal' : 'purple'} side />
      <Card.Body>
        <Grid.Row>
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`COST`}</h5>
            <p>{`${numeral(coverageFeeAPR).format('0.00')}% for ${numeral(coveragePercentage).format('0')}% coverage`}</p>
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
