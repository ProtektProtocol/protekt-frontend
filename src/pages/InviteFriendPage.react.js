// @flow

import React, { useContext, useState, useEffect } from 'react';
import { ethers } from "ethers";
import _ from 'lodash';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import Web3 from 'web3';
import axios from 'axios';

import {
  Page,
  Grid,
  Dimmer,
  Text,
  Header,
  Avatar
} from "tabler-react";

import Form from "../components/tablerReactAlt/src/components/Form";

import Card from "../components/tablerReactAlt/src/components/Card";
import Button from "../components/tablerReactAlt/src/components/Button";
import ProtektDepositCard from "../components/ProtektDepositCard";
import SiteWrapper from "../SiteWrapper.react";

import {
  useGasPrice,
  useTokenPrices,
  useContractLoader,
  useContractReader,
} from "../hooks";

import { Transactor } from "../utils";
import { Web3Context } from '../App.react';
import { default as protektData } from "../data";
import { infuraProvider, INFURA_LINK } from "../config";
import { generateBurnerAccount } from '../utils';
import { GetBalanceOfERC20ForAddress } from '../utils'

function InviteFriendPage() {
  const [loading, setLoading] = useState(false);
  const referralToken = protektData.referralToken;
  const tokenPrices = useTokenPrices(
    infuraProvider,
    ['dai','cdai','weth','cusdc','usdc','ausdc']
  );
  const web3Context = useContext(Web3Context);
  const gasPrice = useGasPrice("fast");
  const contracts = useContractLoader(web3Context.provider);
  const [burnerAccount, setBurnerAccount] = useState({})
  const [activeEmail, setActiveEmail] = useState('')
  let amount = '50';
  
  const [balance, setBalance] = useState(0)
  useEffect(() => {
    async function run() {
      let erc20Balance = await GetBalanceOfERC20ForAddress(
        protektData['contracts']['pausdc']['address'],
        protektData['contracts']['pausdc']['abi'],
        web3Context.address,
        6
      );
      let balance = 0
      if(!_.isEmpty(tokenPrices)){
        balance = tokenPrices['usdc']['usd'] * erc20Balance
      }
      setBalance(balance)
    }

    if(web3Context.ready && web3Context.address) {
      run();       
    }
  },[tokenPrices, web3Context]);


  const [needsApproval, setNeedsApproval] = useState(true);
  useEffect(() => {
    async function run() {
      const weiAmount = ethers.utils.parseUnits('50', referralToken.underlyingTokenDecimals);
      const allowanceAmount = await contracts[referralToken.coreToken]["allowance"](...[web3Context.address, protektData.contracts[referralToken.pTokenSymbol]["address"]]);

      if(weiAmount.gt(allowanceAmount)) {
        setNeedsApproval(true);
      } else {
        setNeedsApproval(false);
      }
    }

    if(web3Context.address && referralToken && !_.isEmpty(contracts)) {
      console.log("rerun")
      run();       
    }
  },[web3Context, contracts, loading]);

  // Called after a successful approval
  function handleTxSuccess() {
    console.log('Successful tx')
    // let url = `https://2pisj0nu70.execute-api.us-east-1.amazonaws.com/dev/send-email/?email=${activeEmail}&address=${burnerAccount.address}&privateKey=${burnerAccount.privateKey}`
    // await axios.get(url) // can't check for errors here atm due to AWS throwing that internal error on return but it works
    console.log(needsApproval)
    setNeedsApproval(!needsApproval);
    setLoading(false)
  }

  async function handleDepositTx() {

    let burnerAccount = await generateBurnerAccount()
    setBurnerAccount(burnerAccount)

    // let burnerWalletAddress = burnerAccount.address
    let burnerWalletAddress = '0xE1Fe0E20b2f79D9831b73960c8364ACF4D4FC4B9'
    console.log(burnerAccount)
    console.log(web3Context)
    if(web3Context.ready) {
      const tx = Transactor(web3Context.provider, handleTxSuccess, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount, referralToken.underlyingTokenDecimals);
      const allowanceAmount = await contracts[referralToken.coreToken]["allowance"](...[web3Context.address, protektData.contracts[referralToken.pTokenSymbol]["address"]]);

      if(weiAmount.gt(allowanceAmount)) {
        console.log('hitting inside')
        tx(contracts[referralToken.coreToken]["approve"](protektData.contracts[referralToken.pTokenSymbol]["address"], weiAmount));
      } else {
        // depositCoreTokens(uint256 _amount, address depositor, address referer)
        console.log(web3Context)
        console.log(contracts)
        tx(contracts[referralToken.pTokenSymbol]["depositCoreTokens(uint256,address,address)"](weiAmount, burnerWalletAddress, web3Context.address));
      }
    }
  }

  const validate = values => {
    const errors = {};
    if (!values.email && !needsApproval) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) && !needsApproval) {
      errors.email = 'Invalid email';
    } else if (web3Context.ready && balance < 50) {
      errors.balance = 'Need at least $50 USDC';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      balance: 50
    },
    validate,
    onSubmit: values => {
      setLoading(true);
      setActiveEmail(values['email'])
      handleDepositTx();
    },
  });

  // console.log('needsApproval',needsApproval);
  // console.log('loading',loading);
  // console.log('txStatus',txStatus);
  // console.log(contracts[referralToken.pTokenSymbol]);

  return (
    <SiteWrapper>
      <Page.Content>
        <Grid.Row cards={true} className="d-flex justify-content-center">
          <Grid.Col xs={12} sm={12} lg={10} offsetSm={1} class="text-center position-relative">
            <div className="mb-1 position-relative ticket-form">
              <Card.Body className="text-center">
                <Grid.Row cards={true}>
                  <Grid.Col xs={12} sm={8} offsetSm={1} class="text-center">
                    <div className="d-flex align-items-sm-center justify-content-sm-center">
                      <Text size="h5" className="mr-2 mb-0" RootComponent="span" >
                        {`BUY FOR`}
                      </Text>
                      <Text size="h2" align="center" RootComponent="span" className="mr-2 mb-0">{`$${amount}`}</Text>
                      <Text size="h5" className="mr-2 mb-0" RootComponent="span" >
                        {`IN`}
                      </Text>
                      <Avatar
                        imageURL={`assets/${`usdc-logo`}.png`}
                        style={{"verticalAlign":"middle"}}
                        RootComponent="span" 
                      />
                    </div>
                    {true && <span className="invalid-feedback">{"formik.errors.balance"}</span>}
                    <Text size="h5" className="mt-4">
                      {`GIVE TO`}
                    </Text>
                    <Form onSubmit={formik.handleSubmit}> 
                      <Form.Group>
                        <Grid.Row>
                          <Grid.Col xs={12} sm={8} offsetSm={2}>
                            <Form.InputGroup>
                              <Form.Input
                                name="email"
                                type="email"
                                placeholder="friend@tradfi.com"
                                disabled={needsApproval}
                                value={formik.values.email}
                                className={"form-control input-group-text"}
                                onChange={formik.handleChange}
                                feedback={formik.errors.balance || formik.errors.email}
                                invalid={formik.errors.email}
                              />
                            </Form.InputGroup>
                          </Grid.Col>
                        </Grid.Row>
                      </Form.Group>
                        <Form.Group>
                          <Button
                            color="secondary"
                            icon={needsApproval ? "toggle-left" : "toggle-right"}
                            loading={loading && needsApproval}
                            disabled={!needsApproval}
                            type="submit"
                            value="Submit"
                            className="color mt-2 mr-2"
                            >
                            {needsApproval ? "First you need to Approve" : "Approved"}
                          </Button>
                          <Button
                            color="teal"
                            icon="download"
                            loading={loading && !needsApproval}
                            disabled={needsApproval}
                            type="submit"
                            value="Submit"
                            className="color mt-2 ml-2"
                            >
                            { `Deposit` }
                          </Button>
                      </Form.Group>
                    </Form>
                  </Grid.Col>
                </Grid.Row>
              </Card.Body>
            </div>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row className="d-flex justify-content-center">
          <Grid.Col sm={12} lg={8}>
            <Card className="mt-9" title={(<h2 className="mb-0">How it Works</h2>)}>
            <Card.Body>
                <Text>
👻 Using Aave is the best way to learn about DeFi...
                </Text>
                <br/>
                <Text>
🚂 Buy a $50 ticket to the DeFi Train and email it to a non-DeFi friend!
                </Text>
                <br/>
                <Text>
🤑 Your $50 is deposited into Aave so it starts earning interest immediately! 
                </Text>
                <br/>
                <Text>
🤝 For the referral, 20% of the interest accrues to you, so your friend, you, and the DeFi space all win together!
                </Text>
                <br/>
                <Grid.Row>
                  <Grid.Col xs={12} className="text-center">
                    <div>
                      <img src={`static/defiTrainDiagram.png`} alt={`DeFi Train Diagram`} />
                    </div>
                  </Grid.Col>
                </Grid.Row>
                <br/>
                <Text.Small size={"sm"}>
                  <em>
For onboarding someone new into DeFi, you're also secretly earning $CHOO tokens...</em> 🤫😉
                </Text.Small>
                <br/>
                <br/>
                <Text>
Cheers,<br/>
🛡🛡 <a href={`https://www.protektprotocol.com/`} target="_blank">Protekt Protocol Team</a> 🛡🛡
                </Text>
            </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default InviteFriendPage;
