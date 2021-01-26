// @flow

import React, { useState, useEffect, useContext } from 'react';
import numeral from 'numeral';
import { ethers } from "ethers";

import {
  Grid,
  Header,
  Dimmer,
  Button,
  Form
} from "tabler-react";

import Card from "../tablerReactAlt/src/components/Card";
import DepositWithdrawTokensForm from "../DepositWithdrawTokensForm";

import { useGasPrice, useCompoundDaiCoverageMetrics, getTokenBalances, getClaimsManager } from "../../hooks";
import { Transactor } from "../../utils";
import {Web3Context} from '../../App.react';

type Props = {|
  +children?: React.Node,
  +item?: Object,
  +lendingMarketMetrics?: Object,
  +tokenPrices?: Object,
  +contracts: Object,
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
  const [accountBalances, setAccountBalances] = useState({loading: true});
  const [claimsManager, setClaimsManager] = useState({loading: true});
  useEffect( () => {
    const getBals = async () => {
      const bal = await getTokenBalances(
        web3Context.address,
        tokenPrices,
        contracts,
        [item.underlyingTokenSymbol, item.pTokenSymbol, item.reserveTokenSymbol, item.shieldTokenSymbol],
        [item.underlyingTokenDecimals, item.pTokenDecimals, item.reserveTokenDecimals, item.shieldTokenDecimals],
        [item.pTokenAddress, item.pTokenAddress, item.shieldTokenAddress, item.shieldTokenAddress]
      )
      setAccountBalances(bal)
    }
    getBals();
  },[web3Context, contracts]);
  useEffect( () => {
    const getData = async () => {
      const data = await getClaimsManager(
        contracts,
        item.claimsContractId
      )
      setClaimsManager(data)
    }
    getData();
  },[web3Context, contracts]);
  // --- For getting the rewards tokens for the address ---
  // const [rewardsTokenBalance, setRewardsTokenBalance] = useState(0);
  // useEffect( () => {
  //   const getRewardBal = async () => {
  //     if(contracts && contracts[item.protektRedeemId]) {
  //       let rewardTokenAmount = await contracts[item.protektRedeemId]["claimStatus"](...[web3Context.address, 1, 2]);
  //       setRewardsTokenBalance(rewardTokenAmount);
  //     }
  //   }
  //   getRewardBal();
  // },[web3Context, contracts]);
  const coverage = useCompoundDaiCoverageMetrics(
    Web3Context.provider,
    item,
    contracts,
    tokenPrices,
    lendingMarketMetrics.length > 0 ? lendingMarketMetrics[0] : {}
  );

  async function handleTxSuccess() {
    console.log('Successful callback')
    // let prevAccountBalances = accountBalances;

      // console.log('Prev bals');
      // console.log(prevAccountBalances);

    // setTimeout(async () => {
      // let temp = await getAccountBalances(item, tokenPrices, contracts);
      // setAccountBalances(temp)

      // console.log('New bals');
      // console.log(temp);

    // }, 5000);
  }

  async function handleDepositTx(amount) {
    console.log(contracts
      )

    if(web3Context.ready) {
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

  async function handleSubmitClaimTx() {
    if(web3Context.ready) {
      const tx = Transactor(web3Context.provider, handleTxSuccess, gasPrice);
      tx(contracts[item.claimsContractId]["submitClaim"]());
    }
  }

  function renderDepositCard() {
    return (
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

    )
  }

  function renderHoldingsCard() {
    return (
      <Card.Body>
        <Grid.Row>
          <Grid.Col width={12}>
            <Header.H4 className="mb-2">{`You're earning a return and are protected.`}<span role="img">✅😇👌</span></Header.H4>
          </Grid.Col>
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`YOUR DEPOSITS`}</h5>
            <p>{`${numeral(ethers.utils.formatUnits(accountBalances[item.pTokenSymbol]["token"],item.underlyingTokenDecimals)).format('0.00')} ${item.underlyingTokenSymbol.toUpperCase()} (${numeral(accountBalances[item.underlyingTokenSymbol]["usd"]).format('$0.00')})`}</p>
          </Grid.Col>
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`TOTAL DEPOSITS`}</h5>
            <p>{`${numeral(parseFloat(ethers.utils.formatUnits(coverage.pTokenTotalDepositTokens,item.underlyingTokenDecimals))).format('0,0.00')} ${item.underlyingTokenSymbol.toUpperCase()} (${numeral(coverage.pTokenTotalDepositUsd).format('$0,0')})`}</p>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={5} >
            <h5 className="m-0 text-muted">{`REDEEM EARNINGS`}</h5>
            <Form.Group label={`Check & collect your rewards!`}>
              <Button
                RootComponent="a"
                color="cyan"
                className="color mt-1 mb-3"
                icon={ "award" }
                href={`https://protekt-redeem-${item.rewardToken}-kovan.herokuapp.com`}
                target="_blank"
              >
                { `Go to Redeem App` }
              </Button>
            </Form.Group>
            <h5 className="m-0 text-muted">{`DEPOSIT`}</h5>
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
            <h5 className="m-0 text-muted">{`SUBMIT CLAIM`}</h5>
            <Form.Group label={claimsManager.loading ? `` : 
              claimsManager.activePayoutEvent ? `Payout Event found` :
                `No Payout Event found`
            }>
              <Button
                RootComponent="a"
                color="primary"
                className="color mt-1 mb-3"
                icon={ "life-buoy" }
                onClick={() => handleSubmitClaimTx()}
              >
                { `Submit Claim` }
              </Button>
            </Form.Group>
            <h5 className="m-0 text-muted">{`WITHDRAW`}</h5>
            <DepositWithdrawTokensForm
              item={item}
              accountBalances={accountBalances}
              web3Context={web3Context}
              tokenPrices={tokenPrices}
              contracts={contracts}
              handleSubmit={handleWithdrawTx}
              label={`For withdraw: ${numeral(ethers.utils.formatUnits(accountBalances[item.pTokenSymbol]["token"],item.pTokenDecimals)).format('0.00')} ${item.pTokenSymbol}`}
              buttonIcon={ "upload" }
              buttonLabel={ "Withdraw" }
            />
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
    )
  }

  return (
    <Card
      isCollapsible
      title= {(
        <Card.Title>
          { `Earn ${numeral(coverage.netAdjustedAPR).format('0.00')}% APR on ${item.underlyingToken.toUpperCase()} with ${item.underlyingProtocol.toUpperCase()}` }
        </Card.Title>
      )}
    >
      <Card.Status color={(item.underlyingProtocol === 'compound') ? 'teal' : 'purple'} side />
      { (web3Context.ready &&
          !accountBalances.loading &&
            accountBalances[item.pTokenSymbol]["token"] !== "0") ?
              renderHoldingsCard() : <div></div>
      }
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
      { !web3Context.ready ?
          (<Card.Body><Header.H4 className="text-center">Connect Wallet <span role="img">👆</span></Header.H4></Card.Body>) : 
            accountBalances.loading ? <Card.Body><Dimmer active loader /></Card.Body> : 
              accountBalances[item.pTokenSymbol]["token"] === "0" ?
                renderDepositCard() :
                  (<div></div>)
      }
    </Card>
  )
}

/** @component */
export default ProtektDepositCard;
