// @flow

import React, { useState, useEffect } from 'react';
import numeral from 'numeral';

import {
  Grid,
  // Card,
  Form,
  Button,
  Header,
} from "tabler-react";

import Card from "../tablerReactAlt/src/components/Card";
import DisplayToken from "../DisplayToken";

import { useGasPrice } from "../../hooks";
// import { userProvider } from "../Account";
import { useUserAddress } from "eth-hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import { Transactor } from "../../utils";

// const gasPrice = useGasPrice("fast");


type Props = {|
  +children?: React.Node,
  +item?: Object,
|};

function ProtektDepositCard({
  children,
  item,
}: Props): React.Node {
  // const tx = Transactor(userProvider, gasPrice)
  // const pToken = useContractLoader('pToken', userProvider)


  let sideColor = (item.protocol === 'compound') ? 'teal' : 'purple';

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
            <Form.Group label="Your wallet: 196.0000 cDAI">
              <Form.InputGroup>
                <Form.Input placeholder="0.00" />
                <Form.InputGroupAppend>
                  <Button
                    RootComponent="a"
                    color="primary"
                    icon="download"
                    onClick={()=>{
                      console.log("Deposit")
                      /* look how you call setPurpose on your contract: */
                      // tx( writeContracts.YourContract.setPurpose(newPurpose) )
                    }}
                  >
                    Deposit
                  </Button>
                </Form.InputGroupAppend>
              </Form.InputGroup>
            </Form.Group>
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
