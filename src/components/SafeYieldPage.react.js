// @flow

import React, { useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";

import numeral from "numeral"
import Blockies from 'react-blockies';

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
  // Dropdown,
  Button,
  // StampCard,
  // StatsCard,
  // ProgressCard,
  // Badge,
  Dimmer
} from "tabler-react";

import ResourceCard from "./ResourceCard";
import SiteWrapper from "../SiteWrapper.react";

import awsconfig from '../services/amplify/aws-exports';
import { API, graphqlOperation } from "aws-amplify";
import * as queries from '../services/amplify/graphql/queries';

import * as data from '../data/bal_query_short.json';
const balancerMembers = data.default

function returnTableRows(items) {
  return items.map((item, key) => {
      return returnTableRow(item, key)
    }
  )
}

function returnTableRow(item, key) {
  let displayAddr = item.addr.substring(0,6) + '...' + item.addr.slice(-4)
  
  return (
    <Table.Row key={key}>
      <Table.Col className="w-1">
        <Link to={`/address/${item.addr}`}>
        <div style={{borderRadius: '50%', overflow: "hidden", height: "32px"}}>
          <Blockies
            seed={item.addr}
          />
        </div>
        </Link>
      </Table.Col>
      <Table.Col className="w-1">
        <Link to={`/address/${item.addr}`}>
          <a target="_blank" rel="noopener noreferrer" href={item.addr}>{displayAddr}</a>
        </Link>
      </Table.Col>
      <Table.Col>{item.balCategory}</Table.Col>
      <Table.Col>{numeral(item.balBalance).format('0,0.00')}</Table.Col>
      <Table.Col>{numeral(item.balPercentOwnership).format('0.000000%')}</Table.Col>
      <Table.Col className="w-1">
        <Link to={`/address/${item.addr}`}>
          <Icon link={true} name="arrow-right-circle" />
        </Link>
      </Table.Col>
    </Table.Row>
  )
}

function returnProtektContractCoverageCards(items=[]) {
  return items.map((item, key) => {
    return (
      <Card
        key={key}
        isCollapsed
        isCollapsible
        title={ `Earn ${'8.00%'} APR on ${'DAI'} in ${'Compound'}` }
      >
        <Card.Status color="teal" side />
        <Card.Body>
          Ok
          <Dimmer active loader />
        </Card.Body>
      </Card>
    )
  })
}

function SafeYield() {
  let protektContracts = [1, 2]

  return (
    <SiteWrapper>
      <Page.Content title="🏦 Safe Yield Opportunities">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            { !protektContracts.length ? <Dimmer active loader /> : 
              returnProtektContractCoverageCards(protektContracts)
            }
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default SafeYield;
