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

import DefiTrainEarningsCard from "../components/DefiTrainEarningsCard";


const YourEarnings = ({match, location})  => {

  const {params : {publicKey} } = match;

  console.log(publicKey)
  
  const tokenPrices = useTokenPrices(
    infuraProvider,
    ['usdc','ausdc'] // need to add in two protekt tokens
  );

  console.log(tokenPrices)

  const lendingMarketMetrics = useLendingMarketMetrics(600000);

  const handleSubmit = (e) => {
    e.preventDefault()
    // let email = "byrnes68@tcd.ie"
    
    // // some transaction is made

    // // on accept

    //   // generate new wallet
    //   let web3 = new Web3(INFURA_LINK)
    //   let newAccount = web3.eth.accounts.create(web3.utils.randomHex(32))
    //   let address = newAccount['address']
    //   let privateKey = newAccount['privateKey'] // is it wise to store this here incase person creating it accesses it? -> lambda may be be better

    //   // send email
    //   let result = SendEmail(email,address,privateKey)

  }

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
            <Accordion
              allowZeroExpanded
            >
              { (!lendingMarketMetrics.length || _.isEmpty(tokenPrices)) ? <Card><Card.Body></Card.Body></Card> : 
                returnCards(protektData.protektContracts, lendingMarketMetrics, tokenPrices)
              }
            </Accordion>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
      
    </SiteWrapper>
  )
}

export default YourEarnings;