// @flow

import React, { useState, useEffect, useContext } from 'react';
import numeral from 'numeral';
import { ethers } from "ethers";
import _ from "lodash";

import {
  Grid,
  Header,
  Dimmer,
  Button,
  Form,
  Avatar,
  Text,
  Tag
} from "tabler-react";

import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import Card from "../tablerReactAlt/src/components/Card";
import DepositWithdrawTokensForm from "../DepositWithdrawTokensForm";

import {
  useGasPrice,
  getCompoundDaiCoverageMetrics,
  useCompoundDaiCoverageMetrics,
  useAccountBalances,
  getClaimsManager,
  useContractLoader
} from "../../hooks";
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
  contracts
}: Props): React.Node {
  const web3Context = useContext(Web3Context);
  const readContracts = useContractLoader(web3Context.provider);
  const gasPrice = useGasPrice("fast");
  const coverage = useCompoundDaiCoverageMetrics(
    item,
    readContracts,
    tokenPrices,
    lendingMarketMetrics[0]
  );
  const [claimsManager, setClaimsManager] = useState({loading: true});
  useEffect( () => {
    const getData = async () => {
      const data = await getClaimsManager(
        item,
        readContracts
      )
      setClaimsManager(data)
    }
    getData();
  },[web3Context, readContracts]);
  const accountBalances = useAccountBalances(
    web3Context.address,
    tokenPrices,
    readContracts,
    [item.underlyingTokenSymbol, item.pTokenSymbol, item.reserveTokenSymbol, item.shieldTokenSymbol],
    [item.underlyingTokenDecimals, item.pTokenDecimals, item.reserveTokenDecimals, item.shieldTokenDecimals],
    [item.pTokenAddress, item.pTokenAddress, item.shieldTokenAddress, item.shieldTokenAddress],
    [null, item.underlyingTokenSymbol, null, item.reserveTokenSymbol]
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
    if(web3Context.ready) {
      const tx = Transactor(web3Context.provider, handleTxSuccess, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.reserveTokenDecimals);
      const allowanceAmount = await contracts[item.reserveTokenSymbol]["allowance"](...[web3Context.address, item.shieldTokenAddress]);

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

  function renderDepositCard() {
    return (
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
              handleSubmit={handleDepositTx}
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
              disabled={true}
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
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`YOUR DEPOSITS`}</h5>
            <p>{`${numeral(ethers.utils.formatUnits(accountBalances[item.shieldTokenSymbol]["depositedTokenBalance"],item.reserveTokenDecimals)).format('0.00')} ${item.reserveTokenSymbol.toUpperCase()} (${numeral(accountBalances[item.shieldTokenSymbol]["depositedTokenBalanceUsd"]).format('$0.00')})`}</p>
          </Grid.Col>
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`CLAIMS STATUS`}</h5>
            <Form.Group label={claimsManager.loading ? `` : 
              claimsManager.activePayoutEvent ? `Payout Event found` :
                `No Payout Event found`
            }/>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={5} >
            <h5 className="m-0 text-muted">{`DEPOSIT`}</h5>
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
          </Grid.Col>
          <Grid.Col width={5} offset={1}>
            <h5 className="m-0 text-muted">{`WITHDRAW`}</h5>
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
              disabled={true}
            />
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
    )
  }

  return ( (coverage.loading || _.isEmpty(accountBalances)) ? <Card><Card.Body><Dimmer active loader /></Card.Body></Card> : 
    <AccordionItem>
      <Card>
        <AccordionItemHeading>
          <AccordionItemButton>
            <Card.Body>
              <Grid.Row alignItems="center" justifyContent="center">
                <Grid.Col width={2} className="text-center">
                  <Text>{item.id}</Text>
                </Grid.Col>
                <Grid.Col width={2} className="text-center">
                  <Text size="h4" RootComponent="div">{`${numeral(coverage.coverageFeeAPR).format('0.00')}%`}</Text>
                  <Text muted RootComponent="span">{` ON`}</Text><br/>
                  <Avatar
                    imageURL={`assets/${item.reserveTokenLogo}.png`}
                    style={{"verticalAlign":"middle"}}
                  />
                  <Text size="h4" align="center" RootComponent="span" className="ml-2">{item.reserveTokenSymbol.toUpperCase()}</Text>
                </Grid.Col>
                <Grid.Col width={3} className="text-center">
                  <Avatar
                    imageURL={`assets/${item.coreTokenLogo}.png`}
                    style={{"verticalAlign":"middle"}}
                  />
                  <Text size="h4" align="center" RootComponent="span" className="ml-2">{item.coreToken.toUpperCase()}</Text>
                  <Text muted>IN</Text>
                  <Avatar
                    imageURL={`assets/${item.protocolLogo}.png`}
                    style={{"verticalAlign":"middle"}}
                    size="lg"
                  />
                  <Text size="h4" align="center" RootComponent="span" className="ml-0">{item.underlyingProtocol.toUpperCase()}</Text>
                </Grid.Col>
                <Grid.Col width={3} className="text-center">
                  <Tag.List>
                    <Tag rounded color="purple">{item.riskTag}</Tag>
                  </Tag.List>
                </Grid.Col>
                <Grid.Col width={2} className="text-center">
                  <Text align="center">
                    {`${numeral(coverage.shieldTokenTotalDepositUsd).format('$0,0.00a')}`}
                  </Text>
                  <Text align="center" size="sm" muted>
                    {`${numeral(parseFloat(ethers.utils.formatUnits(coverage.shieldTokenTotalDepositTokens,item.reserveTokenDecimals))).format('0,0.00a')} ${item.reserveTokenSymbol.toUpperCase()}`}
                  </Text>
                </Grid.Col>
              </Grid.Row>
            </Card.Body>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          { (web3Context.ready &&
              !_.isEmpty(accountBalances) &&
                accountBalances[item.shieldTokenSymbol]["token"] !== "0") ?
                  renderHoldingsCard() : <div></div>
          }
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
          { !web3Context.ready ?
              (<Card.Body><Header.H4 className="text-center">Connect Wallet <span role="img">👆</span></Header.H4></Card.Body>) : 
                _.isEmpty(accountBalances) ? <Card.Body><Dimmer active loader /></Card.Body> : 
                  accountBalances[item.shieldTokenSymbol]["token"] === "0" ?
                    renderDepositCard() :
                      <div></div>
          }
        </AccordionItemPanel>
      </Card>
      </AccordionItem>
  )
}

/** @component */
export default StakingDepositCard;
