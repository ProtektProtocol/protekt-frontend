// @flow

import React, { useState, useEffect, useContext } from 'react';
import numeral from 'numeral';
import { useFormik } from 'formik';

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
}: Props): React.Node {
  let sideColor = (item.protocol === 'compound') ? 'teal' : 'purple';

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
      isCollapsed
      isCollapsible
      title= {(
        <Card.Title>
          { `Earn ${numeral(item.apr).format('0.00')}% APR on ${item.token.toUpperCase()} on ${item.protocol.toUpperCase()}` }
        </Card.Title>
      )}
    >
      <Card.Status color={sideColor} side />
      <Card.Body>
        <Grid.Row>
          <Grid.Col width={6}>
            <h5 className="m-0 text-muted">{`COST`}</h5>
            <p>{`2.60% for 100% coverage`}</p>
            <h5 className="m-0 text-muted">{`BACKED BY`}</h5>
            <p>{`wETH (Not invested)`}</p>
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
              Start earning safely
            </Header.H4>
            <Form onSubmit={depositFormik.handleSubmit}>
              <Form.Group label="Your wallet: 196.0000 cDAI">
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
            <Form.Group label="Your wallet: 0.0000 cDAI">
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
