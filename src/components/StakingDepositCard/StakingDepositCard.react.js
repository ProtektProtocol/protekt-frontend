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

import { useGasPrice, useCompoundDaiCoverageMetrics, getTokenBalances } from "../../hooks";
import { Transactor } from "../../utils";
import { Web3Context } from '../../App.react';

type Props = {|
  +children?: React.Node,
  +item?: Object,
  +lendingMarketMetrics?: Object,
  +tokenPrices?: Object,
  +contracts?: Object,
|};

function StakingDepositCard({
  children,
  item,
  lendingMarketMetrics,
  tokenPrices,
  contracts,
}: Props): React.Node {
  const web3Context = useContext(Web3Context);
  const gasPrice = useGasPrice("fast");
  const [accountBalances, setAccountBalances] = useState({loading: true})
  useEffect( () => {
    const getBals = async () => {
      const bal = await getTokenBalances(
        web3Context.address,
        item,
        tokenPrices,
        contracts,
        [item.underlyingTokenSymbol, item.pTokenSymbol, item.reserveTokenSymbol, item.shieldTokenSymbol],
        [item.pTokenAddress, item.pTokenAddress, item.shieldTokenAddress, item.shieldTokenAddress]
      )
      setAccountBalances(bal)
    }
    getBals();
  },[]);
  const coverage = useCompoundDaiCoverageMetrics(
    Web3Context.provider,
    item,
    contracts,
    tokenPrices,
    lendingMarketMetrics.length > 0 ? lendingMarketMetrics[0] : {}
  );
  
  async function handleTxSuccess() {
    console.log('Successful callback')
    let prevAccountBalances = accountBalances;

      // console.log('Prev bals');
      // console.log(prevAccountBalances);

    setTimeout(async () => {
      // let temp = await getAccountBalances(item, tokenPrices, contracts);
      // setAccountBalances(temp)

      // console.log('New bals');
      // console.log(temp);

    }, 5000);
  }

  async function handleDepositTx(amount) {
    if(web3Context.ready && amount > 0) {
      const tx = Transactor(web3Context.provider, handleTxSuccess, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.reserveTokenDecimals);
      const allowanceAmount = await contracts[item.reserveSymbol]["allowance"](...[web3Context.address, item.shieldTokenAddress]);

      if(weiAmount.gt(allowanceAmount)) {
        tx(contracts[item.reserveTokenSymbol]["approve"](item.shieldTokenAddress, ethers.utils.parseUnits('1000000',item.reserveTokenDecimals)));
      } else {
        tx(contracts[item.shieldTokenSymbol]["deposit"](weiAmount));
      }
    }
  }

  async function handleWithdrawTx(amount) {
    if(web3Context.ready && amount > 0) {
      const tx = Transactor(web3Context.provider, handleTxSuccess, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.shieldTokenDecimals);
      tx(contracts[item.shieldTokenSymbol]["withdraw"](weiAmount));
    }
  }

  return (accountBalances.loading) ? <Dimmer active loader /> : (
    <Card
      isCollapsible
      title= {(
        <Card.Title>
          { `Earn ${numeral(coverage.coverageFeeAPR).format('0.00')}% APR on ${item.reserveTokenSymbol.toUpperCase()} protecting ${item.underlyingProtocol.toUpperCase()} deposits` }
        </Card.Title>
      )}
    >
      <Card.Status color={(item.underlyingProtocol === 'compound') ? 'teal' : 'purple'} side />
      <Card.Body>
        <Grid.Row>
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`TOTAL AMOUNT STAKED`}</h5>
            <p>{`${numeral(parseFloat(ethers.utils.formatUnits(coverage.shieldTokenTotalDepositTokens,item.shieldTokenDecimals))).format('0,0.00')} ${item.reserveTokenSymbol.toUpperCase()} (${numeral(coverage.shieldTokenTotalDepositUsd).format('$0,0')})`}</p>
            <h5 className="m-0 text-muted">{`REINVESTED`}</h5>
            <p>{`${item.strategyDisplay}`}</p>
          </Grid.Col>
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`CLAIMS`}</h5>
            <p>{`Claims are investigated for a period of 1 week, and the payout decision is made by a DAO vote.`}</p>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={12}>
            <h5 className="m-0 text-muted">{`COVERAGE FOR`}</h5>
            <p>{`Protection against 1) smart contract bugs that allow hackers to steal or lock DAI and 2) risk that admin keys are stolen or used to withdraw DAI. Not covered: 1) Risk of a Maker hack or DAI lossing its peg. 2) Risk of flash loan or other financial exploit.`}</p>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Body>
        <Grid.Row>
          <Grid.Col width={5} >
            <Header.H4>
              Stake to start earning
            </Header.H4>
            <DepositWithdrawTokensForm
              item={item}
              accountBalances={accountBalances}
              web3Context={web3Context}
              tokenPrices={tokenPrices}
              contracts={contracts}
              handleSubmit={handleWithdrawTx}
              label={`Your wallet: ${numeral(ethers.utils.formatUnits(accountBalances[item.reserveTokenSymbol]["token"],item.reserveTokenDecimals)).format('0.00')} ${item.reserveTokenSymbol.toUpperCase()}`}
              buttonIcon={ accountBalances[item.reserveTokenSymbol] && 
                            accountBalances[item.reserveTokenSymbol]["allowance"] &&
                              accountBalances[item.reserveTokenSymbol]["allowance"].gt(0) ?
                                "download" : 
                                  "toggle-left"
                        }
              buttonLabel={ accountBalances[item.reserveTokenSymbol] && 
                        accountBalances[item.reserveTokenSymbol]["allowance"] &&
                          accountBalances[item.reserveTokenSymbol]["allowance"].gt(0) ?
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
              label={`Your deposits: ${numeral(ethers.utils.formatUnits(accountBalances[item.shieldTokenSymbol]["token"],item.shieldTokenDecimals)).format('0.00')} ${item.shieldTokenSymbol.toUpperCase()}`}
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
export default StakingDepositCard;
