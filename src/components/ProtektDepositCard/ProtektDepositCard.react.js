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

import { useGasPrice, useCompoundDaiCoverageMetrics, useTokenBalances } from "../../hooks";
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
  const coverage = useCompoundDaiCoverageMetrics(
    Web3Context.provider,
    item,
    contracts,
    tokenPrices,
    lendingMarketMetrics.length > 0 ? lendingMarketMetrics[0] : {}
  );
  const accountBalances = useTokenBalances(
    web3Context.address,
    item,
    tokenPrices,
    contracts,
    [item.underlyingTokenSymbol, item.pTokenSymbol, item.reserveTokenSymbol, item.shieldTokenSymbol],
    [item.pTokenAddress, item.pTokenAddress, item.shieldTokenAddress, item.shieldTokenAddress]
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
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.underlyingTokenDecimals);
      const allowanceAmount = await contracts[item.underlyingTokenSymbol]["allowance"](...[web3Context.address, item.pTokenAddress]);

      if(weiAmount.gt(allowanceAmount)) {
        tx(contracts[item.underlyingTokenSymbol]["approve"](item.pTokenAddress, ethers.utils.parseUnits('1000000',item.underlyingTokenDecimals)));
      } else {
        tx(contracts[item.pTokenSymbol]["deposit"](weiAmount));
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
  
  useEffect( () => {
    console.log('Checking...')
    console.log(accountBalances)
    console.log(JSON.stringify(accountBalances))
    console.log(accountBalances.loading)
    console.log(!!accountBalances.loading)
    setLoading(accountBalances.loading)
  });
 
  console.log("Render")
  console.log(JSON.stringify(accountBalances))

  return (loading) ? <Dimmer active loader /> : (
    <Card
      isCollapsible
      title= {(
        <Card.Title>
          { `Earn ${numeral(coverage.netAdjustedAPR).format('0.00')}% APR on ${item.underlyingTokenSymbol.toUpperCase()} with ${item.underlyingProtocol.toUpperCase()}` }
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
        { accountBalances.loading ? <Dimmer active loader /> : (
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
        )}
      </Card.Body>
    </Card>
  )
}

/** @component */
export default ProtektDepositCard;
