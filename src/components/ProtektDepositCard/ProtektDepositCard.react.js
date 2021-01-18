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

type Props = {|
  +children?: React.Node,
  +item?: Object,
|};

function ProtektDepositCard({
  children,
  item,
}: Props): React.Node {

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
      <Card.Status color="teal" side />
      <Card.Body>
        <Grid.Row>
          <Grid.Col width={6}>
            <h4 className="m-0">{`COST`}</h4>
            <p>{`2.60% for 100% coverage`}</p>
            <h4 className="m-0">{`BACKED BY`}</h4>
            <p>{`wETH (Not invested)`}</p>
          </Grid.Col>
          <Grid.Col width={6}>
            <h4 className="m-0">{`CLAIMS`}</h4>
            <p>{`Claims are investigated for a period of 1 week, and the payout decision is made by a DAO vote.`}</p>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={12}>
            <h4 className="m-0">{`COVERAGE FOR`}</h4>
            <p>{`Protection against 1) smart contract bugs that allow hackers to steal or lock DAI and 2) risk that admin keys are stolen or used to withdraw DAI. Not covered: 1) Risk of a Maker hack or DAI lossing its peg. 2) Risk of flash loan or other financial exploit.`}</p>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Footer>
        <Grid.Row>
          <Grid.Col width={5} >
            <Header.H3>
              Start earning safely
            </Header.H3>
            <Form.Group label="Your wallet: 196.0000 cDAI">
              <Form.InputGroup>
                <Form.Input placeholder="0.00" />
                <Form.InputGroupAppend>
                  <Button
                    RootComponent="a"
                    color="primary"
                    icon="download"
                    href="http://www.google.com"
                  >
                    Deposit
                  </Button>
                </Form.InputGroupAppend>
              </Form.InputGroup>
            </Form.Group>
          </Grid.Col>
          <Grid.Col width={5} offset={1}>
            <Header.H3>
              Withdraw anytime
            </Header.H3>
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
      </Card.Footer>
    </Card>
  )
}

/** @component */
export default ProtektDepositCard;
