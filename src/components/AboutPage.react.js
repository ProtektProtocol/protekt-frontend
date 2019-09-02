// @flow

import * as React from "react";

import { Grid, Card, Button, Form, Dimmer } from "tabler-react";
import Page from "../tabler-react-alt/src/components/Page";

import SiteWrapper from "../SiteWrapper.react";

let content = `
Lorem ipsum dolor amet snackwave sustainable beard gentrify celiac, bushwick synth irony vice iceland marfa locavore next level. Stumptown quinoa dreamcatcher, offal helvetica craft beer migas bicycle rights typewriter vinyl. Kickstarter live-edge gastropub yr. Meggings prism everyday carry, normcore 3 wolf moon YOLO cold-pressed. Brooklyn gastropub venmo pug keffiyeh fingerstache small batch authentic truffaut you probably haven't heard of them dreamcatcher cray vaporware.
`


function AboutPage(): React.Node {
  return (
    <SiteWrapper>
      <Page.Content title="About" headerClassName="d-flex justify-content-center">
        <Grid.Row className="d-flex justify-content-center">
          <Grid.Col sm={6} xl={6}>
            <Card
              title="Card blue"
              statusColor="blue"
              body={content}
            />
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  );
}

export default AboutPage;
