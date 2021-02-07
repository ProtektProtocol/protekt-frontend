// @flow

import React, { useContext } from 'react';

import {
  Page,
  Grid,
  Dimmer,
  Text,
  Form,
  Header
} from "tabler-react";

import Button from "../components/tablerReactAlt/src/components/Button";

import {
  Accordion
} from 'react-accessible-accordion';

import Card from "../components/tablerReactAlt/src/components/Card";
import StakingDepositCard from "../components/StakingDepositCard";
import SiteWrapper from "../SiteWrapper.react";

import { useTokenPrices, useLendingMarketMetrics } from "../hooks";
import { default as protektData } from "../data";
import { infuraProvider } from "../config";

import _ from 'lodash';

/*
    page uses your web3 connected wallet for account balance & details
*/
const YourEarnings = ()  => {

  
  const tokenPrices = useTokenPrices(
    infuraProvider,
    ['usdc','ausdc'] // need to add in two protekt tokens
  );




  return (
    <SiteWrapper>
      <Page.Content title="💰 Your Earnings">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            <Card className="mb-1">
              <Card.Body className="p-1">
                <Grid.Row alignItems="center" justifyContent="center">
                  <Grid.Col width={2}>
                    <Text 
                      muted
                      align="center"
                    >
                      ASSET
                    </Text>
                  </Grid.Col>
                  <Grid.Col width={3}>
                    <Text 
                      muted
                      align="center"
                    >
                      PROTOCOL
                    </Text>
                  </Grid.Col>
                  <Grid.Col width={2}>
                    <Text 
                      muted
                      align="center"
                    >
                      YIELD
                    </Text>
                  </Grid.Col>
                  <Grid.Col  width={2}>
                    <Text 
                      muted
                      align="center"
                    >
                      TOTAL DEPOSITS
                    </Text>
                  </Grid.Col>
                  <Grid.Col width={3}>
                    <Text 
                      muted
                      align="center"
                    >
                      YOUR GAINZ
                    </Text>
                  </Grid.Col>
                </Grid.Row>
              </Card.Body>
             </Card>
            <Accordion
              allowZeroExpanded
            >

            </Accordion>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
      
      <Page.Content title="🤝 Your Referral Gains">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
          <Card className="mb-1">
              <Card.Body className="p-1">
                <Grid.Row alignItems="center" justifyContent="center">
                  <Grid.Col width={2}>
                    <Text 
                      muted
                      align="center"
                    >
                      ASSET
                    </Text>
                  </Grid.Col>
                  <Grid.Col width={3}>
                    <Text 
                      muted
                      align="center"
                    >
                      PROTOCOL
                    </Text>
                  </Grid.Col>
                  <Grid.Col width={2}>
                    <Text 
                      muted
                      align="center"
                    >
                      YIELD
                    </Text>
                  </Grid.Col>
                  <Grid.Col  width={2}>
                    <Text 
                      muted
                      align="center"
                    >
                      TOTAL DEPOSITS
                    </Text>
                  </Grid.Col>
                  <Grid.Col width={3}>
                    <Text 
                      muted
                      align="center"
                    >
                      YOUR GAINZ
                    </Text>
                  </Grid.Col>
                </Grid.Row>
              </Card.Body>
             </Card>
            <Accordion
              allowZeroExpanded
            >

            </Accordion>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
      
    </SiteWrapper>
  )
}

export default YourEarnings;