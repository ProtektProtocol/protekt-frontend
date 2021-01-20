// @flow

import React, { useState, useEffect, useContext } from 'react';
import numeral from 'numeral';
import { useFormik } from 'formik';
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

import { useGasPrice, useContractLoader } from "../../hooks";
import { useUserAddress } from "eth-hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import { Transactor } from "../../utils";
import {Web3Context} from '../../App.react';

// const gasPrice = useGasPrice("fast");


type Props = {|
  +children?: React.Node,
  +item?: Object,
  +lendingMarketMetrics?: Object,
  +tokenPrices?: Object,
  +contracts?: Object,
|};

function sendDepositTx(amount) {
  const web3Context = useContext(Web3Context);
  if(web3Context.provider && amount > 0) {
    const gasPrice = useGasPrice("fast");
    const tx = Transactor(web3Context.provider, gasPrice);
    const contracts = useContractLoader(web3Context.provider);

    tx(contracts.pToken.deposit('100'))
  }
}

function ProtektDepositCard({
  children,
  item,
  lendingMarketMetrics,
  tokenPrices,
  contracts,
}: Props): React.Node {
  const web3Context = useContext(Web3Context);
  // const address = useUserAddress(web3Context.provider);
  const address = '0xDF1b1c58FC59cbCe9e11c37aD239B37Cf56e7a5A';

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
  console.log(item)
  console.log(lendingMarketMetrics)
  console.log(tokenPrices)
  console.log(contracts)

  useEffect(() => {
    async function getAccountBalances(item, tokenPrices, contracts) {
      let balances = {};
      try {
        const underlyingTokenBalance = await contracts[item.underlyingTokenSymbol]["balanceOf"](...[address]);
        const pTokenBalance = await contracts["pToken"]["balanceOf"](...[address]);

        // console.log('-------')
        // console.log(underlyingTokenBalance.toString())
        // console.log(pTokenBalance.toString())

        balances[item.underlyingTokenSymbol] = {
          token: underlyingTokenBalance.toString(),
          usd: 0
        };
        balances[item.pTokenSymbol] = {
          token: pTokenBalance.toString(),
          usd: 0
        };

        // console.log('-------')
        // pTokenTotalDeposit * price / shieldTokenTotalDeposit * price
        // console.log(pTokenTotalDeposit.div(1).div(tokenPrices[item.reserveTokenSymbol]['usd']).mul(tokenPrices[item.underlyingTokenSymbol]['usd']))
        setAccountBalances(balances)
      } catch (error) {
        console.error(error);
      }
      
    }
    getAccountBalances(item, tokenPrices, contracts)
  }, [contracts]);
  

  useEffect(() => {
    async function calcCoveragePercentage(item, tokenPrices, contracts) {
      let coverage = 100;
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
      setCoveragePercentage(coverage)
    }
    calcCoveragePercentage(item, tokenPrices, contracts)
  }, [contracts]);

  const coverageFeeAPR = item.maxBlockFeeAPR * coveragePercentage
  const netAdjustedAPR = lendingMarket.apr - coverageFeeAPR

  const depositFormik = useFormik({
    initialValues: {
      pTokenDepositAmount: 0,
    },
    onSubmit: values => {
      sendDepositTx(values.pTokenDepositAmount)
    },
  });

  return (
    <Card
      isCollapsible
      title= {(
        <Card.Title>
          { `Earn ${numeral(netAdjustedAPR).format('0.00')}% APR on ${lendingMarket.token.toUpperCase()} on ${lendingMarket.protocol.toUpperCase()}` }
        </Card.Title>
      )}
    >
      <Card.Status color={(item.protocol === 'compound') ? 'teal' : 'purple'} side />
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
            <Form onSubmit={depositFormik.handleSubmit}>
              <Form.Group label={`Your wallet: ${numeral(ethers.utils.formatUnits(accountBalances[item.underlyingTokenSymbol]["token"],item.underlyingTokenDecimals)).format('0.00')} ${item.underlyingTokenSymbol.toUpperCase()}`}>
                <Form.InputGroup>
                  <Form.Input
                    id='pTokenDepositAmount'
                    name='pTokenDepositAmount'
                    type='text'
                    value={depositFormik.values.pTokenDepositAmount}
                    placeholder="0.00"
                    disabled={depositFormik.values.pTokenDepositAmount < 0}
                    onChange={depositFormik.handleChange}
                  />
                  <Form.InputGroupAppend>
                    <Button
                      RootComponent="a"
                      color="primary"
                      icon="download"
                      type="submit"
                      value="Submit"
                      href={'#'}
                    >
                      Deposit
                    </Button>
                  </Form.InputGroupAppend>
                </Form.InputGroup>
              </Form.Group>
            </Form>
          </Grid.Col>
          <Grid.Col width={5} offset={1}>
            <Header.H4>
              Withdraw anytime
            </Header.H4>
              <Form.Group label={`For withdrawal: ${numeral(ethers.utils.formatUnits(accountBalances[item.pTokenSymbol]["token"],item.pTokenDecimals)).format('0.00')} ${item.pTokenSymbol}`}>
              <Form.InputGroup>
                <Form.Input
                  disabled={true}
                  placeholder="0.00"
                />
                <Form.InputGroupAppend>
                  <Button
                    disabled={true}
                    RootComponent="a"
                    color="primary"
                    icon="upload"
                    href="http://www.google.com"
                  >
                    Withdraw
                  </Button>
                </Form.InputGroupAppend>
              </Form.InputGroup>
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
    </Card>
  )
}

/** @component */
export default ProtektDepositCard;
