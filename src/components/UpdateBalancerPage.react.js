// @flow

import React, { useState } from 'react';
import {
  Link
} from "react-router-dom";

import {
  Page,
  Avatar,
  Icon,
  Grid,
  Card,
  Loader,
  // Text,
  Table,
  // Alert,
  // Progress,
  colors,
  Form,
  Button,
  // StampCard,
  // StatsCard,
  // ProgressCard,
  Dimmer,
} from "tabler-react";

import SiteWrapper from "../SiteWrapper.react";

import awsconfig from '../services/amplify/aws-exports';
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from '../services/amplify/graphql/mutations';

import * as data from '../data/bal_query_long.json';
const balancerMembers = data.default




async function transformAddress(addressJson) {
  return {
    addr: addressJson.addr.split("=")[1].split("&")[0],
    isContract: addressJson.is_contract === "🤖",
    balBalance: addressJson.balance,
    balPercentOwnership: addressJson.percent_ownership,
    balCategory: addressJson.labels ? addressJson.labels : "Holder",
    balStatus: addressJson.balance > 0 ? "ACTIVE" : "INACTIVE",
    balChange30d: addressJson.change_30d,
    balChange7d: addressJson.change_7d,
    balRecv: addressJson.recv,
    balDaysSinceFirstReceived: addressJson.DaysSinceFirstReceived,
    balFirstReceivedAt: addressJson.first_received_at,
    nansenLink: addressJson.addr,
    etherscanLink: addressJson.etherscan_addr,
    balLabels: addressJson.labels
  }
}

function UpdateBalancer() {
  const [updateJson, setUpdateJson] = useState(JSON.stringify(balancerMembers))
  const [loading, setLoading] = useState(false)

  async function updateAddresses(updateJson) {
    setLoading(true)
    let addrHoldings = JSON.parse(updateJson)
    let output = []
    let i = 0

    
    for (i = 0; i < addrHoldings.length; i++) {
      try {

        let formatedAddress = await transformAddress(addrHoldings[i])
        let updatedAddress = await API.graphql(graphqlOperation(
          mutations.createAddress,
          {input: formatedAddress}
        ))

        output.push(updatedAddress)
      }
      catch(e) {
        console.error(e)
        console.log(addrHoldings[i])
      }        
    }

    setLoading(false)
    return output
  }

  return (
    <SiteWrapper>
      <Page.Content title="👪 Update Balancer">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            <Card>
              <Card.Body>
                { loading ? <Dimmer active loader /> : (
                  <div>
                    <Form.Group label={<Form.Label>Address JSON</Form.Label>}>
                      <Form.Textarea
                        defaultValue={updateJson}
                        name="updateJson-textarea"
                        placeholder="Enter JSON here"
                      />
                    </Form.Group>
                    <Button
                      onClick={() => updateAddresses(updateJson)}
                    >Update
                    </Button>
                  </div>                
                  )
                }
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default UpdateBalancer;
