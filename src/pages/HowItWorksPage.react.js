// @flow

import React from 'react';

import {
  Page,
  Grid,
  Card,
  Text,
  Header,
  List
} from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";


function HowItWorks() {

  return (
    <SiteWrapper>
      <Page.Content headerClassName="d-flex justify-content-center">
        <Grid.Row className="d-flex justify-content-center">
          <Grid.Col sm={12} xl={6}>
            <Card
              statusColor="cyan"
            >
            <Card.Header>
              <Grid.Row>
                <Grid.Col xs={12} xl={6} className="text-center">
                  <div>
                    <img src={`${process.env.PUBLIC_URL}/static/illustration01.svg`} alt={`${process.env.PUBLIC_URL}/static/illustration01.svg`} />
                  </div>
                </Grid.Col>
                <Grid.Col xs={12} xl={6} className="text-center">
                  <Header.H2 className="mt-8">
                    Protekt Protocol
                  </Header.H2>
                  <Header.H4 className="text-muted">
                    DeFi insurance so you don't get #rekt.
                  </Header.H4>
                </Grid.Col>
              </Grid.Row>
            </Card.Header>
            <Card.Body>
                <Text>
Protekt Protocol puts crypto to work insuring users against hacks, bugs, and other exploits of any DeFi protocol. The goal is to support and catalyze the growth of the DeFi ecosystem by protecting users from getting rekt.
                </Text>
                <br/>
                <Text>
                  <strong>
No protocol token has been launched at this time.
                  </strong>
                </Text>
                <br/>
                <Text>
Learn More:
                </Text>
                <Grid.Col auto={true} className="d-flex">
                  <List className="list-inline list-inline-dots mb-0 d-none d-md-flex">
                    <List.Item className="list-inline-item">
                      <a href="https://protektprotocol.com" target="_blank" rel="noopener noreferrer">Home Page</a>
                    </List.Item>
                  </List>
                </Grid.Col>
                <Grid.Col auto={true} className="d-flex">
                  <List className="list-inline list-inline-dots mb-0 d-none d-md-flex">
                    <List.Item className="list-inline-item">
                      <a href="https://docs.protektprotocol.com" target="_blank" rel="noopener noreferrer">Documentation</a>
                    </List.Item>
                  </List>
                </Grid.Col>
                <Grid.Col auto={true} className="d-flex">
                  <List className="list-inline list-inline-dots mb-0 d-none d-md-flex">
                    <List.Item className="list-inline-item">
                      <a href="https://twitter.com/protektprotocol" target="_blank" rel="noopener noreferrer">Twitter</a>
                    </List.Item>
                  </List>
                </Grid.Col>
                <Grid.Col auto={true} className="d-flex">
                  <List className="list-inline list-inline-dots mb-0 d-none d-md-flex">
                    <List.Item className="list-inline-item">
                      <a href="https://t.me/protektdefi" target="_blank" rel="noopener noreferrer">Telegram</a>
                    </List.Item>
                  </List>
                </Grid.Col>
                <Grid.Col auto={true} className="d-flex">
                  <List className="list-inline list-inline-dots mb-0 d-none d-md-flex">
                    <List.Item className="list-inline-item">
                      <a href="https://github.com/ProtektProtocol" target="_blank" rel="noopener noreferrer">Github</a>
                    </List.Item>
                  </List>
                </Grid.Col>
                <br/>


                <Text>
Cheers,<br/>
🛡🛡 Protekt Community 🛡🛡
                </Text>
            </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default HowItWorks;