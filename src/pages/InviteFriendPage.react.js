// @flow

import React, { useContext, useState } from 'react';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';

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
import { infuraProvider } from "../config";

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
                <Form> 
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
                      <NumberFormat
                        placeholder="Enter a friend's email"
                        isNumericString={true}
                        thousandSeparator={true}
                        className={"form-control"}
                        onValueChange={() => {}}
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
