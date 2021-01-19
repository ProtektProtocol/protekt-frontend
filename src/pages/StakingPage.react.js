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
  Dimmer
} from "tabler-react";

import StakingDepositCard from "../components/StakingDepositCard";
import SiteWrapper from "../SiteWrapper.react";

function returnCards(items=[]) {
  return items.map((item, key) => {
    return (
      <StakingDepositCard
        key={key}
        item={item}
      />
    )
  })
}

function Staking() {
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
      <Page.Content title="🛡 Stake to Shield Mine">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            { !protektContracts.length ? <Dimmer active loader /> : 
              returnCards(protektContracts)
            }
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default Staking;