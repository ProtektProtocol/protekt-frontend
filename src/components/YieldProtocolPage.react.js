// @flow

import * as React from "react";
import Airtable from "airtable"
import ReactMarkdown from "react-markdown"

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
    const input = `|Protocol (Token)|Description|Rewards|How to access|
|--|--|--|--|--|
|[Compound](https://compound.finance/) ($COMP)|Lending protocol where anyone can deposit or borrow tokens at rates set by the market. Borrowers typically want to trade tokens with leverage, and lenders typically want to earn a return on their holdings without giving up custody. [Lending]|Each day, approximately ~2,880 COMP will be distributed to users of the protocol; the distribution is allocated to each market (ETH, USDC, DAI…), proportional to borrowing demand in that market. Within each market, 50% of the distribution is earned by suppliers, and 50% by borrowers.|[Compound dapp](https://app.compound.finance/)|
|[Balancer](https://balancer.finance/) ($BAL)|Dex and automated market-maker that allows anyone to create or add liquidity to customizable pools and earn trading fees. Pools can be customized for specifc token allocations and trading fees, and a centralized routers makes sure all trades get the best price across pools. [Dex] [Portfolio Mgmt]|145,000 BAL every week with offchain rules so the team is iterating quickly on. More info can be found here: https://forum.balancer.finance/|[Balancer dapp](https://pools.balancer.exchange/#/) [Zapper Pools](https://www.zapper.fi/invest)|`


    return (
      <SiteWrapper>
        <Page.Content title="👨‍🌾  Yield Farming Protocols">
          <div
            dangerouslySetInnerHTML={{
              __html: `<iframe class="airtable-embed" src="https://airtable.com/embed/shrTixkUzdF5X46K4?backgroundColor=green&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>`
            }}>
          </div>
          <div>
            <ReactMarkdown source={input} />
          </div>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default DefiPage;
