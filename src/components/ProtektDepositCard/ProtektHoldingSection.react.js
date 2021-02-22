// @flow

import React from 'react';
import numeral from 'numeral';
import { ethers } from "ethers";

import {
  Grid,
  Dimmer,
  Button,
  Form,
} from "tabler-react";

import Card from "../tablerReactAlt/src/components/Card";
import DepositWithdrawTokensForm from "../DepositWithdrawTokensForm";
import { Transactor } from "../../utils";

type Props = {|
  +item?: Object,
  +tokenPrices?: Object,
  +web3Context?: Object,
  +gasPrice?: Object,
  +contracts?: Object,
  +claimsManager?: Object,
  +accountBalances: Object,
  +needsApproval: boolean,
  +setNeedsApproval: fn,
|};

function ProtektHoldingSection({
  item,
  tokenPrices,
  web3Context,
  gasPrice,
  contracts,
  coverage,
  claimsManager,
  accountBalances,
  needsApproval,
  setNeedsApproval
}: Props): React.Component {



  async function handleDepositTx(amount, successCb, failedCb) {
    if(web3Context.ready) {
      if(needsApproval) {
        const callback = () => {
          setNeedsApproval(false);
          successCb();
        }
        const tx = Transactor(web3Context.provider, callback, failedCb, gasPrice);

        tx(contracts[item.coreTokenSymbol]["approve"](item.pTokenAddress, ethers.utils.parseUnits('10000000',item.coreTokenDecimals)));
      } else {
        const tx = Transactor(web3Context.provider, successCb, failedCb, gasPrice);
        let weiAmount = ethers.utils.parseUnits(amount.toString(), item.coreTokenDecimals);
        tx(contracts[item.pTokenSymbol]["depositCoreTokens(uint256)"](weiAmount));
      }
    }
  }

  async function handleWithdrawTx(amount, successCb, failedCb) {
    if(web3Context.ready && amount > 0) {
      const tx = Transactor(web3Context.provider, successCb, failedCb, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount.toString(), item.pTokenDecimals);
      tx(contracts[item.pTokenSymbol]["withdraw"](weiAmount));
    }
  }

  async function handleSubmitClaimTx(cb) {
    if(web3Context.ready) {
      const tx = Transactor(web3Context.provider, cb, cb, gasPrice);
      tx(contracts[item.claimsContractId]["submitClaim"]());
    }
  }

  if(!accountBalances.ready || accountBalances[item.pTokenSymbol]["token"] === "0") {
    return (<div></div>)
  } else if(coverage.loading) {
    return (<Card.Body><Dimmer active loader /></Card.Body>)
  }

  return (
    <Card.Body>
      <Grid.Row>
        <Grid.Col width={6}>
          <h5 className="m-0 text-muted">{`YOUR DEPOSITS`}</h5>
          <p>{`${numeral(ethers.utils.formatUnits(accountBalances[item.pTokenSymbol]["token"],item.underlyingTokenDecimals)).format('0.00')} ${item.underlyingTokenSymbol.toUpperCase()} (${numeral(accountBalances[item.pTokenSymbol]["depositedTokenBalanceUsd"]).format('$0.00')})`}</p>
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
              href={`https://${item.protektRedeemId}.herokuapp.com`}
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
            label={`Your wallet: ${numeral(ethers.utils.formatUnits(accountBalances[item.coreTokenSymbol]["token"],item.coreTokenDecimals)).format('0.00')} ${item.coreTokenSymbol.toUpperCase()}`}
            buttonIcon={ needsApproval ?
                                "toggle-left" :
                                "download"
                        }
            buttonLabel={ needsApproval ?
                            "Approve" :
                            "Deposit"
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
            label={`For withdraw: ${numeral(ethers.utils.formatUnits(accountBalances[item.pTokenSymbol]["token"],item.pTokenDecimals)).format('0.00')} ${item.pTokenSymbol.toUpperCase()}`}
            buttonIcon={ "upload" }
            buttonLabel={ "Withdraw" }
          />
        </Grid.Col>
      </Grid.Row>
    </Card.Body>
  )
}

/** @component */
export default ProtektHoldingSection;