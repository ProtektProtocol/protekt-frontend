// @flow

import React, { useState, useEffect, useContext, useReducer } from 'react';
import numeral from 'numeral';
import { ethers } from "ethers";
import _ from "lodash";

import Account from "../Account";

import ContentLoader from 'react-content-loader'

import DepositWithdrawTokensForm from "../DepositWithdrawTokensForm";
import ProtektHoldingSection from "./ProtektHoldingSection.react";

import Dimmer from '../tablerReactAlt/src/components/Dimmer'
import Tag from '../tablerReactAlt/src/components/Tag'
import Avatar from '../tablerReactAlt/src/components/Avatar'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import {
  useGasPrice,
  useCompoundDaiCoverageMetrics,
  useAccountBalances,
  useContractLoader,
  useContractReader,
  useClaimsManager,
  useInterval
} from "../../hooks";
import { GetAccountBalances, Transactor } from "../../utils";
import {Web3Context} from '../../App.react';
import { infuraProvider } from "../../config";

const MyLoader = () => (
  <ContentLoader
    height={20}
    width={30}>
    <rect x="0" y="0" rx="0" ry="0" width="30" height="20" />
  </ContentLoader>
)

const isLoading = (loading, node) => {
  if(!loading) {
    return node;
  }
  return <MyLoader />;
}

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
}: Props): React.Node {
  const web3Context = useContext(Web3Context);
  const gasPrice = useGasPrice("fast");
  const contracts = useContractLoader(web3Context.provider);
  const [requery,setRequery] = useState(0)
  // const [,forceUpdate] = useReducer(x=>x+1,0)

  const coverage = useCompoundDaiCoverageMetrics(
    item,
    contracts,
    tokenPrices,
    lendingMarketMetrics[0]
  );


  const claimsManager = useClaimsManager(
    item,
    contracts
  );

  const [accountBalances, setAccountBalances] = useState({ready:false})

  useInterval(async () => {
    (async function(){
      const newAccountBalances = await GetAccountBalances(
        web3Context.address,
        tokenPrices,
        contracts,
        [item.underlyingTokenSymbol, item.pTokenSymbol, item.reserveTokenSymbol, item.shieldTokenSymbol, item.coreTokenSymbol],
        [item.underlyingTokenDecimals, item.pTokenDecimals, item.reserveTokenDecimals, item.shieldTokenDecimals, item.coreTokenDecimals],
        [item.pTokenAddress, item.pTokenAddress, item.shieldTokenAddress, item.shieldTokenAddress, item.pTokenAddress],
        [null, item.underlyingTokenSymbol, null, item.reserveTokenSymbol, null]
      )

      setAccountBalances({...newAccountBalances})
    })();
  }, 5000)

  // const [accountBalances] = useAccountBalances(
  //   requery,
  //   web3Context,
  //   tokenPrices,
  //   contracts,
  //   [item.underlyingTokenSymbol, item.pTokenSymbol, item.reserveTokenSymbol, item.shieldTokenSymbol, item.coreTokenSymbol],
  //   [item.underlyingTokenDecimals, item.pTokenDecimals, item.reserveTokenDecimals, item.shieldTokenDecimals, item.coreTokenDecimals],
  //   [item.pTokenAddress, item.pTokenAddress, item.shieldTokenAddress, item.shieldTokenAddress, item.pTokenAddress],
  //   [null, item.underlyingTokenSymbol, null, item.reserveTokenSymbol, null]
  // );

  console.log('logging account balances')
  console.log(accountBalances)


  async function handleDepositTx(amount, cb) {
    if(web3Context.ready) {
      const tx = Transactor(web3Context.provider, cb, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.coreTokenDecimals);
      const allowanceAmount = await contracts[item.coreTokenSymbol]["allowance"](...[web3Context.address, item.pTokenAddress]);

      if(weiAmount.gt(allowanceAmount)) {
        tx(contracts[item.coreTokenSymbol]["approve"](item.pTokenAddress, ethers.utils.parseUnits('1000000',item.coreTokenDecimals)), cb);
      } else {
        console.log('logging amount',amount)
        tx(contracts[item.pTokenSymbol]["depositCoreTokens(uint256)"](weiAmount), cb);
      }
    }
  }

  async function handleWithdrawTx(amount, cb) {
    if(web3Context.ready && amount > 0) {
      const tx = Transactor(web3Context.provider, cb, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.pTokenDecimals);
      tx(contracts[item.pTokenSymbol]["withdraw"](weiAmount));
    }
  }

  async function handleSubmitClaimTx(cb) {
    if(web3Context.ready) {
      const tx = Transactor(web3Context.provider, cb, gasPrice);
      tx(contracts[item.claimsContractId]["submitClaim"]());
    }
  }
  
  function renderDepositCard() {
    return (
      <Card.Body>
        <Row>
          <Col lg={5} >
            <h4>
              Start earning safely
            </h4>
            <DepositWithdrawTokensForm
              item={item}
              accountBalances={accountBalances}
              web3Context={web3Context}
              tokenPrices={tokenPrices}
              contracts={contracts}
              handleSubmit={handleDepositTx}
              label={`Your wallet: ${numeral(ethers.utils.formatUnits(accountBalances[item.coreTokenSymbol]["token"],item.coreTokenDecimals)).format('0.00')} ${item.coreTokenSymbol.toUpperCase()}`}
              buttonIcon={ accountBalances[item.coreTokenSymbol] && 
                            accountBalances[item.coreTokenSymbol]["allowance"] &&
                              accountBalances[item.coreTokenSymbol]["allowance"].gt(0) ?
                                "download" : 
                                  "toggle-left"
                        }
              buttonLabel={ accountBalances[item.coreTokenSymbol] && 
                        accountBalances[item.coreTokenSymbol]["allowance"] &&
                          accountBalances[item.coreTokenSymbol]["allowance"].gt(0) ?
                            "Deposit" : 
                              "Approve"
                    }
              onRequery={()=>{
                setRequery(prevState=>prevState + 1)
              }}
              actionCount={requery}
              key={accountBalances}
            />
          </Col>
          <Col lg={5} offset={1}>
            <h4>
              Withdraw anytime
            </h4>
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
              onRequery={()=>{
                setRequery(prevState=>prevState + 1)
              }}
              actionCount={requery}
              key={accountBalances}
            />
          </Col>
        </Row>
      </Card.Body>

    )
  }

  return ( (coverage.loading) ? <Card><Card.Body><Dimmer active loader /></Card.Body></Card> : 
      <Card className="mb-1">
        <Card.Body>
          <Row className="center full-height">
            <Col className="vertical-center" lg={2}>
              <div>
                <Avatar
                  imageURL={`assets/${item.coreTokenLogo}.png`}
                  style={{"verticalAlign":"middle"}}
                  />
                <h4  className="ml-2">{item.coreToken.toUpperCase()}</h4>
              </div>
            </Col>
            <Col className="vertical-center" lg={3}>
                <div>
                  <Avatar
                    imageURL={`assets/${item.protocolLogo}.png`}
                    style={{"verticalAlign":"middle"}}
                    size="lg"
                  />
                  <h4 className="ml-1">{item.underlyingProtocol.toUpperCase()}</h4>
                </div>
              </Col>
              <Col className="vertical-center" lg={2}>
                <div>
                  <h4 className="mb-0">{`${numeral(coverage.netAdjustedAPR).format('0.00')}%`}</h4>
                </div>
              </Col>
              <Col className="vertical-center" lg={2}>
                <div>
                  <p>
                      {`${numeral(coverage.pTokenTotalDepositUsd).format('$0,0a')}`}
                  </p>
                  <p className="center muted">
                      {`${numeral(parseFloat(ethers.utils.formatUnits(coverage.pTokenTotalDepositTokens,item.underlyingTokenDecimals))).format('0,0a')} ${item.underlyingTokenSymbol.toUpperCase()}`}
                  </p>
                </div>
              </Col>
              <Col lg={3} className="vertical-center">
                <Tag.List>
                  <Tag rounded color="purple">{item.riskTag}</Tag>
                </Tag.List>
              </Col>
            </Row>
          </Card.Body>
          <ProtektHoldingSection
            item={item}
            tokenPrices={tokenPrices}
            web3Context={web3Context}
            gasPrice={gasPrice}
            contracts={contracts}
            coverage={coverage}
            claimsManager={claimsManager}
            accountBalances={accountBalances}
            onRequery={()=>{
                console.log('forcing update')
                setRequery(prevState=>prevState + 1)
              }}
            actionCount={requery}
            key={accountBalances}
          />
          <Card.Body>
            <Row>
              <Col lg={6}>
                <h5 className="m-0 text-muted">{`COST`}</h5>
                <p>{`${numeral(coverage.coverageFeeAPR).format('0.00')}% for ${coverage.coverageRatioDisplay} coverage`}</p>
                <h5 className="m-0 text-muted">{`BACKED BY`}</h5>
                <p>{`${item.backedByDisplay}`}</p>
              </Col>
              <Col isLoading={6}>
                <h5 className="m-0 text-muted">{`CLAIMS`}</h5>
                <p>{`${item.claimsManagerDisplay}`}</p>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <h5 className="m-0 text-muted">{`COVERAGE FOR`}</h5>
                <p>{`${item.coverageDisplay}`}</p>
              </Col>
            </Row>
          </Card.Body>
          { !web3Context.ready ?
              (<Card.Body><h4 className="text-center font-italic">Connect Wallet Above<span role="img">👆</span></h4></Card.Body>) : 
                !accountBalances.ready ? <Card.Body><Dimmer active loader /></Card.Body> : 
                  accountBalances[item.pTokenSymbol]["token"] === "0" ?
                    renderDepositCard() :
                      (<div></div>)
          }
      </Card>
  )
}

/** @component */
export default ProtektDepositCard;
