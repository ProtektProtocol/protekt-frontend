// @flow

import * as React from "react";
import Airtable from "airtable"
import { Page, Grid, Loader } from "tabler-react";
import ResourceCard from "./ResourceCard";
import SiteWrapper from "../SiteWrapper.react";

let db = new Airtable({
  apiKey: 'keyJQeSri1rnEEExD' // Read Only Access
}).base('appo80bRGTFlzqUgk');

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
          imageUrl: record.get('SummaryImage') ? record.get('SummaryImage')[0]['url'] : ''
        }
      });
      thisComponent.setState({
        items: items
      })
    });
  }

  getAllCards(items): React.Node {
    return items.map((item, key) =>
      <Grid.Col width={12} sm={6} lg={4} key={key}>
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
        <Page.Content title="👨‍🌾  Yield Farming Protocols">
          <div
            dangerouslySetInnerHTML={{
              __html: `<iframe class="airtable-embed" src="https://airtable.com/embed/shrTixkUzdF5X46K4?backgroundColor=green&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>`
            }}>
          </div>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default DefiPage;
