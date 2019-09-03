// @flow

import * as React from "react";
import Airtable from "airtable"
import { Page, Grid, Loader } from "tabler-react";
import ResourceCard from "./ResourceCard";
import SiteWrapper from "../SiteWrapper.react";

let db = new Airtable({
  apiKey: 'keyJQeSri1rnEEExD' // Read Only Access
}).base('appo80bRGTFlzqUgk');

function getDeFiResources() {
  let base = new Airtable({
    apiKey: 'keyHbjU0hdcEpQAaG'
  }).base('appo80bRGTFlzqUgk');

  base('DeFi Toolkit').select({
    view: 'Grid view'
  }).firstPage(function(err, records) {
    if (err) { console.error(err); return; }

    let data = records.map(function(record) {
      return {
        title: record.get('Title'),
        description: record.get('Description'),
        link: record.get('Link'),
        imageUrl: record.get('SummaryImage')
      }
    });
    return data
  });
}

let resourceCardData = [
  {
    title: "DeFi Pulse",
    description: "The analytics + rankings hub for DeFi. DeFi Pulse tracks key metrics for Decentralized Finance(DeFi) projects and so you can stay up to date on the latest trends.",
    link: "https://defipulse.com/",
    imageUrl: "./demo/photos/david-klaasen-54203-500.jpg"
  },
  {
    title: "DeFi Pulse",
    description: "The analytics + rankings hub for DeFi. DeFi Pulse tracks key metrics for Decentralized Finance(DeFi) projects and so you can stay up to date on the latest trends.",
    link: "https://defipulse.com/",
    imageUrl: "./demo/photos/david-klaasen-54203-500.jpg"
  },
  {
    title: "DeFi Pulse",
    description: "The analytics + rankings hub for DeFi. DeFi Pulse tracks key metrics for Decentralized Finance(DeFi) projects and so you can stay up to date on the latest trends.",
    link: "https://defipulse.com/",
    imageUrl: "./demo/photos/david-klaasen-54203-500.jpg"
  }
]

class DefiPage extends React.Component<{}> {
  constructor(props) {
    super(props)

    this.state = {
      items: []
    }
  }

  componentDidMount() {
    const thisComponent = this

    db('DeFi Toolkit').select({
      view: 'Grid view'
    }).firstPage(function(err, records) {
      if (err) { console.error(err); return; }

      let items = records.map(function(record) {
        return {
          title: record.get('Title'),
          description: record.get('Description'),
          link: record.get('Link'),
          imageUrl: record.get('SummaryImage') ? record.get('SummaryImage')[0]['url'] : './demo/photos/david-klaasen-54203-500.jpg'
          // imageUrl: "./demo/photos/david-klaasen-54203-500.jpg"
        }
      });
      thisComponent.setState({
        items: items
      })
    });
  }

  getAllCards(items): React.Node {
    return items.map((item, key) =>
      <Grid.Col sm={6} xl={4} key={key}>
        <ResourceCard
          imgSrc={item.imageUrl}
          imgAlt={item.title}
          postHref={item.link}
          title={item.title}
          description={item.description}
        />
      </Grid.Col>  
    );
  }

  render(): React.Node {
    return (
      <SiteWrapper>
        <Page.Content title="🐳 DeFi Toolkit">
          {
            this.state.items.length === 0 ? 
              (
                <Grid.Row className="d-flex justify-content-center">
                  <Loader/>
                </Grid.Row>
              ) :
              (
                <Grid.Row cards deck>
                  { this.getAllCards(this.state.items) }
                </Grid.Row>
              )
          }
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default DefiPage;
