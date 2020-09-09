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

import C3Chart from "react-c3js";
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

function BalancerLeaderboard() {
  const [members, setMembers] = useState([])

  useEffect(() => {
    async function fetchMembers() {
      const initialState = await API.graphql(
        graphqlOperation(
          queries.addressesByStatus, {
            balStatus: 'ACTIVE',
            sortDirection: 'DESC',
          }
        )
      )
      console.log(initialState)
      setMembers(initialState.data.addressesByStatus.items.length ? initialState.data.addressesByStatus.items : [])
    }
    fetchMembers()
  }, []);

  return (
    <SiteWrapper>
      <Page.Content title="👪 Balancer Community">
        <Grid.Row cards={true}>
          <Grid.Col lg={12}>
            <Card>
              <C3Chart
                style={{ height: "10rem" }}
                data={{
                  columns: [
                    // each columns data
                    ["data1", 63],
                    ["data2", 37],
                  ],
                  type: "donut", // default type of chart
                  colors: {
                    data1: colors["green"],
                    data2: colors["green-light"],
                  },
                  names: {
                    // name of each serie
                    data1: "Maximum",
                    data2: "Minimum",
                  },
                }}
                axis={{}}
                legend={{
                  position: "inset",
                  padding: 0,
                  inset: {
                    anchor: "top-left",
                    x: 20,
                    y: 8,
                    step: 10,
                  },
                }}
                tooltip={{
                  format: {
                    title: function(x) {
                      return "";
                    },
                  },
                }}
                padding={{
                  bottom: 0,
                  left: -1,
                  right: -1,
                }}
                point={{
                  show: false,
                }}
              />
              <Card.Body>
                { !members.length ? <Dimmer active loader /> : (
                  <Table
                    cards={true}
                    responsive={true}
                    highlightRowOnHover={true}
                    className="table-vcenter"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.ColHeader colSpan={2}>Member</Table.ColHeader>
                        <Table.ColHeader>Labels</Table.ColHeader>
                        <Table.ColHeader>Balance</Table.ColHeader>
                        <Table.ColHeader>Ownership %</Table.ColHeader>
                        <Table.ColHeader />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      { returnTableRows(members) }
                    </Table.Body>
                  </Table>
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

export default BalancerLeaderboard;
