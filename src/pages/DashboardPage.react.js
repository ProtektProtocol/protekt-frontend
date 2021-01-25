// @flow

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Link
} from "react-router-dom";

import {
  Page,
  Grid,
  Button,
  Dimmer,
  Header
} from "tabler-react";

import DashboardProtektCard from "../components/DashboardProtektCard";
import DashboardShieldCard from "../components/DashboardShieldCard";
import SiteWrapper from "../SiteWrapper.react";

function returnProtektCards(items=[]) {
  return items.map((item, key) => {
    return (
      <DashboardProtektCard
        key={key}
        item={item}
      />
    )
  })
}

function returnShieldCards(items=[]) {
  return items.map((item, key) => {
    return (
      <DashboardShieldCard
        key={key}
        item={item}
      />
    )
  })
}

function Dashboard() {
  const [protektContracts, setProtektContracts] = useState([])

  useEffect(() => {

    async function getProtektContracts() {
      try {
        const response = await axios.get('https://api.defiscore.io/earn/opportunities');
        console.log(response);
        let temp = [response.data.data[0], response.data.data[16]]
        setProtektContracts(temp);
      } catch (error) {
        console.error(error);
      }
    }
    getProtektContracts()
  }, []);

  return (
    <SiteWrapper>
      <Page.Content title="📈 Your Dashboard">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            <Header.H4>Safe Deposits</Header.H4>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            { !protektContracts.length ? <Dimmer active loader /> : 
              returnProtektCards(protektContracts)
            }
          </Grid.Col>
        </Grid.Row>
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            <Header.H4>Staked Assets</Header.H4>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            { !protektContracts.length ? <Dimmer active loader /> : 
              returnShieldCards(protektContracts)
            }
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default Dashboard;