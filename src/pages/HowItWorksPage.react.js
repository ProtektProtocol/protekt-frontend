// @flow

import React from 'react';

import {
  Page,
  Grid,
  Card,
  Text
} from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";


function HowItWorks() {

  return (
    <SiteWrapper>
      <Page.Content title="ℹ️ How it Works" headerClassName="d-flex justify-content-center">
        <Grid.Row className="d-flex justify-content-center">
          <Grid.Col xs={12} xl={6}>
            <Card
              statusColor="cyan"
              body={(
                <Text style={{whiteSpace: "pre-line"}}>
Protekt Protocol puts crypto to work insuring users against hacks, bugs, and other exploits of any DeFi protocol. The goal is to support and catalyze the growth of the DeFi ecosystem by protecting users from getting rekt.
{"\n\n"}

No protocol token has been launched at this time.{"\n\n"}

Cheers,{"\n"}
🛡🛡 Protekt Community 🛡🛡
                </Text>
                )}
            />
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  )
}

export default HowItWorks;