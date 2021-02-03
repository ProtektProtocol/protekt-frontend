// @flow

import React, { useContext, useState } from 'react';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import Web3 from 'web3';

import {
  Page,
  Grid,
  Dimmer,
  Text,
  Form,
  Header
} from "tabler-react";

import {
  Accordion
} from 'react-accessible-accordion';

import Card from "../components/tablerReactAlt/src/components/Card";
import Button from "../components/tablerReactAlt/src/components/Button";
import ProtektDepositCard from "../components/ProtektDepositCard";
import SiteWrapper from "../SiteWrapper.react";

import { useTokenPrices, useLendingMarketMetrics } from "../hooks";
import { default as protektData } from "../data";
import { infuraProvider, INFURA_LINK } from "../config";
import {SendEmail} from '../utils';

function InviteFriendPage() {
  const tokenPrices = useTokenPrices(
    infuraProvider,
    ['dai','cdai','weth','cusdc','usdc','ausdc']
  );
  const lendingMarketMetrics = useLendingMarketMetrics(600000);


  function returnCards(items=[], lendingMarketMetrics, tokenPrices) {
    return items.map((item, key) => {
      return (
        <ProtektDepositCard
          key={key}
          item={item}
          lendingMarketMetrics={lendingMarketMetrics}
          tokenPrices={tokenPrices}
        />
      )
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let email = "byrnes68@tcd.ie"

    // generate new wallet
    let web3 = new Web3(INFURA_LINK)
    let newAccount = web3.eth.accounts.create(web3.utils.randomHex(32))
    let address = newAccount['address']
    let privateKey = newAccount['privateKey'] // is it wise to store this here incase person creating it accesses it? -> lambda may be be better
    
    // some transaction is made and handled
      // Implement this transaction

    // on accept

      // send email
      let result = SendEmail(email,address,privateKey)

  }

  return (
    <SiteWrapper>
      <Page.Content title="🎟 Invite a Friend">
        <Grid.Row cards={true}>
          <Grid.Col xs={12} sm={12} class="text-center">
            <Card className="mb-1">
              <Card.Body className="text-center">
                <Header.H5 className="text-muted">
                  {`SEND`}
                </Header.H5>
                <Header.H1>
                  {`$40`}
                </Header.H1>
                <Header.H5 className="text-muted" >
                  {`IN`}
                </Header.H5>
                <Form
                  onSubmit={e => handleSubmit(e)}
                > 
                  <Form.Group>
                    <Grid.Row classname="mb-2" alignItems="center" justifyContent="center">
                      <Grid.Col offset-sm={2} sm={8} className="mb-2">
                        <Form.SelectGroup canSelectMultiple={false} pills>
                          <Form.SelectGroupItem
                            color="primary"
                            className="color mr-2"
                            type="submit"
                            value="Submit"
                            label="💰 BTC"
                          />
                          <Form.SelectGroupItem
                            color="primary"
                            className="color mr-2"
                            type="submit"
                            value="Submit"
                            label="🦄 ETH"
                          />
                          <Form.SelectGroupItem
                            color="primary"
                            className="color mr-2"
                            type="submit"
                            value="Submit"
                            label="👻 AAVE"
                          />
                          <Form.SelectGroupItem
                            color="primary"
                            className="color mr-2"
                            type="submit"
                            value="Submit"
                            label="🏦 USD"
                          />
                        </Form.SelectGroup>
                      </Grid.Col>
                    </Grid.Row>
                  </Form.Group>
                  <Header.H5 className="text-muted" >
                    {`TO`}
                  </Header.H5>
                  <Form.Group>
                    <Grid.Row>
                    <Grid.Col xs={12} sm={8} offsetSm={2}>
                    <Form.InputGroup>
                      <Form.Input
                        placeholder="Enter a friend's email"
                        className={"form-control"}
                        type="text"
                      />
                    </Form.InputGroup>
                    </Grid.Col>
                    </Grid.Row>
                  </Form.Group>
                  <Form.Group>
                    <Button
                      color="teal"
                      type="submit"
                      value="Submit"
                      className="color mt-2"
                      block
                    >
                      { `Approve & Submit` }
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
