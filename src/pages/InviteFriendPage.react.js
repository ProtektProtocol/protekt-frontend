// @flow

import React, { useContext, useState, useEffect } from 'react';
import { ethers } from "ethers";
import _ from 'lodash';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';

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
import {Web3Context} from '../App.react';
import { default as protektData } from "../data";
import { infuraProvider } from "../config";

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
  let amount = '50';


  const [needsApproval, setNeedsApproval] = useState(true);
  useEffect(() => {
    async function run() {
      const weiAmount = ethers.utils.parseUnits('30', referralToken.underlyingTokenDecimals);
      const allowanceAmount = await contracts[referralToken.coreToken]["allowance"](...[web3Context.address, protektData.contracts[referralToken.pTokenSymbol]["address"]]);

      if(weiAmount.gt(allowanceAmount)) {
        setNeedsApproval(true);
      } else {
        setNeedsApproval(false);
      }
    }

    if(web3Context.address && referralToken && !_.isEmpty(contracts)) {
      run();       
    }
  },[web3Context, contracts]);


  // Called after a successful transaction
  async function handleTxSuccess() {
    console.log('Successful tx')
    setLoading(false)
  }

  async function handleDepositTx() {
    let burnerWalletAddress = web3Context.address;

    if(web3Context.ready) {
      const tx = Transactor(web3Context.provider, handleTxSuccess, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount, referralToken.underlyingTokenDecimals);
      const allowanceAmount = await contracts[referralToken.coreToken]["allowance"](...[web3Context.address, protektData.contracts[referralToken.pTokenSymbol]["address"]]);

      if(weiAmount.gt(allowanceAmount)) {
        tx(contracts[referralToken.coreToken]["approve"](protektData.contracts[referralToken.pTokenSymbol]["address"], ethers.utils.parseUnits('1000000',referralToken.underlyingTokenDecimals)));
      } else {
        // depositCoreTokens(uint256 _amount, address depositor, address referer)
        tx(contracts[referralToken.pTokenSymbol]["depositCoreTokens(uint256,address,address)"](weiAmount, burnerWalletAddress, web3Context.address));
      }
    }
  }

  const validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate,
    onSubmit: values => {
      setLoading(true);
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
        <Grid.Row cards={true}>
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
                                value={formik.values.email}
                                className={"form-control input-group-text"}
                                onChange={formik.handleChange}
                                feedback={formik.errors.email}
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
                            {needsApproval ? "Approve" : "Approved"}
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
            <Card className="mt-9 ml-7" title={(<h2 className="mb-0">How it Works</h2>)}>
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
