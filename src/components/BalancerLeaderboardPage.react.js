// @flow

import * as React from "react";
import Airtable from "airtable"
import ReactMarkdown from "react-markdown"

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
} from "tabler-react";

import C3Chart from "react-c3js";
import ResourceCard from "./ResourceCard";
import SiteWrapper from "../SiteWrapper.react";

import * as data from '../data/bal_query_short.json';
const balancerMembers = data.default

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

  returnTableRows(items): React.Node {
    console.log(items)
    console.log(typeof items)


    return items.map((item, key) =>
      this.returnTableRow(item, key)
    );
  }

  returnTableRow(item, key): React.Node {
    return (
      <Table.Row>
        <Table.Col className="w-1">
          <Avatar imageURL="https://api.adorable.io/avatars/285/abott@adorable.png" />
          <Button link>{item.addr}</Button>
        </Table.Col>
        <Table.Col>{item.labels}</Table.Col>
        <Table.Col>{item.balance}</Table.Col>
        <Table.Col>{item.percent_ownership}</Table.Col>
        <Table.Col className="w-1">
          <Icon link={true} name="trash" />
        </Table.Col>
      </Table.Row>
    )
  }

  render(): React.Node {

    return (
      <SiteWrapper>
        <Page.Content title="👪 Balancer LeaderBoard">
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
                <Table
                  cards={true}
                  striped={false}
                  responsive={true}
                  className="table-vcenter"
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.ColHeader>Member</Table.ColHeader>
                      <Table.ColHeader>Labels</Table.ColHeader>
                      <Table.ColHeader>Balance</Table.ColHeader>
                      <Table.ColHeader>Ownership %</Table.ColHeader>
                      <Table.ColHeader></Table.ColHeader>
                      <Table.ColHeader />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { this.returnTableRows(balancerMembers) }
                  </Table.Body>
                </Table>
              </Card>
            </Grid.Col>

          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default DefiPage;
