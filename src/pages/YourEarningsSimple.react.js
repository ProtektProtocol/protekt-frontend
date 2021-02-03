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
import DefiTrainEarningsCard from "../components/DefiTrainEarningsCard";
import SiteWrapper from "../SiteWrapper.react";

import { useTokenPrices, useLendingMarketMetrics, useAccountBalances } from "../hooks";
import { default as protektData } from "../data";
import { infuraProvider } from "../config";

import _ from 'lodash';


import {useTokenBalance} from "eth-hooks"


/*  
    Page does not require a connected wallet - simply pull from the contract address passed in params
    - for new users who may not have a wallet initially connected.
*/

const YourEarningsSimple = ({match, location})  => {

  const {params : {publicKey} } = match;
  
  // const tokenBalance = useTokenBalance("0xDf8e1af30175AEab4d6bD2d6CA1408db7D548eC9", publicKey); 
  
  
  const tokenPrices = useTokenPrices(
    infuraProvider,
    ['usdc','ausdc'] 
  );

  const lendingMarketMetrics = useLendingMarketMetrics(600000);

  function returnCards(items=[], lendingMarketMetrics, tokenPrices) {
    return items.map((item, key) => {
      return (
        <DefiTrainEarningsCard
          key={key}
          item={item}
          lendingMarketMetrics={lendingMarketMetrics}
          tokenPrices={tokenPrices}
        />
      )
    })
  }


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
              { (!lendingMarketMetrics.length || _.isEmpty(tokenPrices)) ? <Card><Card.Body><Dimmer active loader /></Card.Body></Card> : 
                returnCards(protektData.protektContracts, lendingMarketMetrics, tokenPrices)
              }
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
                      TOTAL SENT
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
              { (!lendingMarketMetrics.length || _.isEmpty(tokenPrices)) ? <Card><Card.Body><Dimmer active loader /></Card.Body></Card> : 
                returnCards(protektData.protektContracts, lendingMarketMetrics, tokenPrices)
              }
            </Accordion>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default YourEarningsSimple;