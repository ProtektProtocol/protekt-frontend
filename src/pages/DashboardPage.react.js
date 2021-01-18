// @flow

import React, { useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";

import numeral from "numeral"
import Blockies from 'react-blockies';

import {
  Page,
  Avatar,
  Icon,
  Grid,
  Card,
  Header,
  Loader,
  Form,
  Table,
  Alert,
  // Progress,
  colors,
  // Dropdown,
  Button,
  // StampCard,
  // StatsCard,
  // ProgressCard,
  // Badge,
  Dimmer
} from "tabler-react";

import ResourceCard from "../components/ResourceCard";
import SiteWrapper from "../SiteWrapper.react";

function returnProtektContractCoverageCards(items=[]) {
  return items.map((item, key) => {
    return (
      <Card
        key={key}
        isCollapsed
        isCollapsible
        title={ `Earn ${'8.00%'} APR on ${'DAI'} in ${'Compound'}` }
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
  })
}

function Dashboard() {
  let protektContracts = [1, 2]

  return (
    <SiteWrapper>
      <Page.Content title="📈 Your Dashboard">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            { !protektContracts.length ? <Dimmer active loader /> : 
              returnProtektContractCoverageCards(protektContracts)
            }
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default Dashboard;