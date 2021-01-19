// @flow

import React, { useState, useEffect, useContext } from 'react';
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

import ProtektDepositCard from "../components/ProtektDepositCard";
import SiteWrapper from "../SiteWrapper.react";

import { useTokenPrice } from "../hooks";
import {Web3Context} from '../App.react';

function returnCards(items=[]) {
  return items.map((item, key) => {
    return (
      <ProtektDepositCard
        key={key}
        item={item}
      />
    )
  })
}

function SafeYield() {
  const [protektContracts, setProtektContracts] = useState([])

  useEffect(() => {
    async function getProtektContracts() {
      try {
        const response = await axios.get('https://api.defiscore.io/earn/opportunities');
        let temp = [response.data.data[0], response.data.data[16]]
        setProtektContracts(temp);
      } catch (error) {
        console.error(error);
      }
    }
    getProtektContracts()
  }, []);

  const web3Context = useContext(Web3Context);
  const tokenPrices = useTokenPrice(web3Context.provider, 'DAI,cDAI,WETH');
  console.log('Token Prices', tokenPrices)

  return (
    <SiteWrapper>
      <Page.Content title="🏦 Earn Safe Yield">
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

export default SafeYield;
