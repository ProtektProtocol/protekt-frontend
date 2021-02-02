// @flow

import React, { useContext, useState } from 'react';
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
  const [txStatus, setTxStatus] = useState('approve');
  const [loading, setLoading] = useState(false);
  const referralToken = protektData.referralToken;
  const tokenPrices = useTokenPrices(
    infuraProvider,
    ['dai','cdai','weth','cusdc','usdc','ausdc']
  );
  const web3Context = useContext(Web3Context);
  const gasPrice = useGasPrice("fast");
  const contracts = useContractLoader(web3Context.provider);

  // Called after a successful transaction
  async function handleTxSuccess() {
    console.log('Successful tx')
    const nextStatus = (txStatus === "approve") ? "deposit" : "approve";
    setTxStatus(nextStatus)
    setLoading(false)
  }

  async function handleDepositTx() {

    let amount = '30';
    let burnerWalletAddress = '0x869eC00FA1DC112917c781942Cc01c68521c415e';

    if(web3Context.ready) {
      const tx = Transactor(web3Context.provider, (txStatus) => handleTxSuccess, gasPrice);
      let weiAmount = ethers.utils.parseUnits(amount, referralToken.underlyingTokenDecimals);
      const allowanceAmount = await contracts[referralToken.coreToken]["allowance"](...[web3Context.address, protektData.contracts[referralToken.pTokenSymbol]["address"]]);

      if(weiAmount.gt(allowanceAmount)) {
        tx(contracts[referralToken.coreToken]["approve"](protektData.contracts[referralToken.pTokenSymbol]["address"], ethers.utils.parseUnits('1000000',referralToken.underlyingTokenDecimals)));
      } else {
        console.log(contracts)
        console.log(contracts[referralToken.pTokenSymbol])
        console.log(contracts[referralToken.pTokenSymbol].deposit)
        console.log(contracts[referralToken.pTokenSymbol]["depositCoreTokens"])

        tx(contracts[referralToken.pTokenSymbol]["deposit"](weiAmount, burnerWalletAddress, web3Context.address));
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

  console.log(contracts);
  console.log(referralToken);
  // console.log(contracts[referralToken.pTokenSymbol]);

  return (
    <SiteWrapper>
      <Page.Content title="🎟 Buy a Ticket for a friend">
        <Grid.Row cards={true}>
          <Grid.Col xs={12} sm={12} class="text-center">
            <Card className="mb-1">
              <Card.Body className="text-center">
                <Text size="h3">
                  {`SEND`}
                </Text>
                <div className="d-flex align-items-sm-center justify-content-sm-center">
                  <Text size="h2" align="center" RootComponent="span" className="mr-2 mb-0">{`$30`}</Text>
                  <Text size="h5" className="text-muted mr-2 mb-0" RootComponent="span" >
                    {`IN`}
                  </Text>
                  <Avatar
                    imageURL={`assets/${`usdc-logo`}.png`}
                    style={{"verticalAlign":"middle"}}
                    RootComponent="span" 
                  />
                </div>
                <Text size="h5" className="text-muted mt-4">
                  {`TO`}
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
                        icon="toggle-left"
                        loading={loading && txStatus === "approve"}
                        disabled={txStatus !== "approve"}
                        type="submit"
                        value="Submit"
                        className="color mt-2 mr-2"
                        >
                        { `Approve` }
                      </Button>
                      <Button
                        color="teal"
                        icon="download"
                        loading={loading && txStatus === "deposit"}
                        disabled={txStatus !== "deposit"}
                        type="submit"
                        value="Submit"
                        className="color mt-2 ml-2"
                        >
                        { `Deposit` }
                      </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default InviteFriendPage;
