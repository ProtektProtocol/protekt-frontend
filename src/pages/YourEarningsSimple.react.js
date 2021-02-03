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

import {useTokenBalance} from "eth-hooks"

import PCUSDC from "../contracts/pcusdc"


const YourEarningsSimple = ({match, location})  => {

  const {params : {publicKey} } = match;
  

  const tokenBalance = useTokenBalance(PCUSDC, publicKey); // USE THE PROTEKT AAVE CONTRACT
  
  const tokenPrices = useTokenPrices(
    infuraProvider,
    ['usdc','ausdc'] 
  );



  return (
    <SiteWrapper>
      <Page.Content title="💰 Your Earnings">
        {/* Display big text ticking up */}
      </Page.Content>
    </SiteWrapper>
  )
}

export default YourEarningsSimple;