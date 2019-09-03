// @flow

import * as React from "react";

import { Grid, Card } from "tabler-react";
import Page from "../tabler-react-alt/src/components/Page";

import SiteWrapper from "../SiteWrapper.react";

function AboutPage(): React.Node {
  return (
    <SiteWrapper>
      <Page.Content title="About" headerClassName="d-flex justify-content-center">
        <Grid.Row className="d-flex justify-content-center">
          <Grid.Col sm={6} xl={6}>
            <Card
              statusColor="blue"
              body={(
              	<p style={{whiteSpace: "pre-line"}}>
The DeFi Toolkit and DeFi Whale twitter bot are tools to make DeFi and the entire Ethereum ecosystem more accessible and useful.{"\n\n"}
Feel free to contact us if you find the service useful and have feature requests. We'll plan to ship updates and new features as soon as we can.{"\n\n"}
Cheers,{"\n"}
🐳🐳 DeFi Whale Team 🐳🐳
								</p>
              	)}
            />
            <Card.Header>
            </Card.Header>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  );
}

export default AboutPage;
