// @flow

import React, { useState, useEffect } from 'react';

import {
  Container,
  Grid,
  Card,
  Button,
  Form,
  Avatar,
  Profile,
  List,
  Media,
  Text,
  Comment,
  Stamp
} from "tabler-react";
import Blockies from 'react-blockies';
import numeral from "numeral"

import SiteWrapper from "../SiteWrapper.react";
import * as data from '../data/bal_query_short.json';

import awsconfig from '../services/amplify/aws-exports';
import { API, graphqlOperation } from "aws-amplify";
import * as queries from '../services/amplify/graphql/queries';

const balancerMembers = data.default



function insertLabels(labels) {
  let labelArray = labels.split("|")
  return labelArray.map((label, key) => {
    return (
      <Stamp size="sm" color="primary" className="mr-1">{label}</Stamp>
    )
  })
}

function AddressPage(props) {
  let params = props.match.params
  let key = params.addr
  console.log(params)
  console.log(key)
  let item = balancerMembers[key]
  let addr = "asd"
  let displayAddr = addr.substring(0,6) + '...' + addr.slice(-4)

  const [address, setAddress] = useState({})

  useEffect(() => {
    async function fetchAddress() {
      let initialState

      try {
        initialState = await API.graphql(
          graphqlOperation(
            queries.getAddress, {
              addr: params.addr
            }
          )
        )        
      }
      catch(e) {
        console.log(e)
      }

      console.log(initialState)
      setAddress(initialState.data.getAddress ? initialState.data.getAddress : {} )
    }
    fetchAddress()
  }, []);




  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Grid.Row>
            <Grid.Col lg={10} className="offset-lg-1">
              <Card>
                <Card.Body>
                  <Media>
                    <div 
                      style={{borderRadius: '50%', overflow: "hidden", height: "5rem", width: "5rem"}}
                      className="mr-5"
                      >
                      <Blockies
                        seed={params.addr}
                        size={8}
                        scale={10}
                      />
                    </div>
                    <Media.BodySocial
                      name={params.addr.substring(0,6) + '...' + params.addr.slice(-4) }
                      workTitle="Unclaimed"
                    >
                      { address.balLabels ? insertLabels(address.balLabels) : "" }
                    </Media.BodySocial>
                  </Media>
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col lg={5} className="offset-lg-1">
              <Card>
                <Card.Header>
                  <Card.Title>Holdings</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Text size="sm" muted>
                    Balance
                  </Text>
                  <h4 className="mb-2">
                    {numeral(address.balBalance).format('0,0') + ' $BAL'}
                  </h4>
                  <Text size="sm" muted>
                    Votes
                  </Text>
                  <h4 className="mb-2">
                    {numeral(address.balBalance).format('0,0')}
                  </h4>
                  <Text size="sm" muted>
                    Delegated Status
                  </Text>
                  <h4 className="mb-2">
                    {'None'}
                  </h4>
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col lg={5}>
              <Card>
                <Card.Header>
                  <Card.Title>Voting</Card.Title>
                </Card.Header>
                <Card.Body className="text-center">
                  <h4 className="mb-2">
                    <em>Coming Soon</em>
                  </h4>
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col lg={10} className="offset-lg-1">
              <Card>
                <Card.Header>
                  <Card.Title>Transactions</Card.Title>
                </Card.Header>
                <Card.Body className="text-center">
                  <h4 className="mb-2">
                    <em>Coming Soon</em>
                  </h4>
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  );
}

export default AddressPage;
