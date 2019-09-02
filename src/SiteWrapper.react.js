// @flow

import * as React from "react";
import { NavLink, withRouter, Link } from "react-router-dom";

import {
  // Site,
  Nav,
  Grid,
  List,
  Button,
  RouterContextProvider,
} from "tabler-react";

import Site from "./tabler-react-alt/src/components/Site";

import type { NotificationProps } from "tabler-react";

type Props = {|
  +children: React.Node,
|};

type State = {|
  notificationsObjects: Array<NotificationProps>,
|};

type subNavItem = {|
  +value: string,
  +to?: string,
  +icon?: string,
  +LinkComponent?: React.ElementType,
  +useExact?: boolean,
|};

type navItem = {|
  +value: string,
  +to?: string,
  +icon?: string,
  +active?: boolean,
  +LinkComponent?: React.ElementType,
  +subItems?: Array<subNavItem>,
  +useExact?: boolean,
|};

const navBarItems: Array<navItem> = [
  {
    value: "DeFi Toolkit",
    to: "/defi",
    icon: "shopping-bag",
    LinkComponent: withRouter(NavLink),
  },
  // {
  //   value: "Stablecoin Stats",
  //   to: "/stable",
  //   icon: "pie-chart",
  //   LinkComponent: withRouter(NavLink),
  // },
  {
    value: "About",
    to: "/about",
    icon: "help-circle",
    LinkComponent: withRouter(NavLink),
  }
];

class SiteWrapper extends React.Component<Props, State> {
  state = {};

  render(): React.Node {
    return (
      <Site.Wrapper
        headerProps={{
          href: "/",
          alt: "DeFi Whale",
          imageURL: "./static/logo_400x400.png",
          navItems: [
            (
              <Nav.Item type="div" className="d-none d-md-flex">
                <List className="list-inline list-inline-dots mb-0">
                  <List.Item className="list-inline-item">
                    <a href="https://twitter.com/messages/compose" target="_blank">Contact</a>
                  </List.Item>
                </List>
              </Nav.Item>
            ),
            (
              <Nav.Item type="div" className="d-none d-md-flex">
                <Button
                  href="https://twitter.com/DeFiWhale"
                  target="_blank"
                  size="md"
                  outline
                  color="primary"
                  RootComponent="a"
                >
                  View on Twitter
                </Button>
              </Nav.Item>
            )
          ]
        }}
        navProps={{ itemsObjects: navBarItems }}
        routerContextComponentType={withRouter(RouterContextProvider)}
        footerProps={{
          copyright: (
            <React.Fragment>
              Copyright © 2019
              <a href="https://twitter.com/DeFiWhale"> DeFi Whale</a>. All rights reserved.
            </React.Fragment>
          ),
          nav: (
            <React.Fragment>
              <Grid.Col auto={true}>
                <List className="list-inline list-inline-dots mb-0">
                  <List.Item className="list-inline-item">
                    <Link to="/about">About</Link>
                  </List.Item>
                </List>
              </Grid.Col>
              <Grid.Col auto={true}>
                <Button
                  href="https://twitter.com/DeFiWhale"
                  target="_blank"
                  size="md"
                  outline
                  color="primary"
                  RootComponent="a"
                >
                  View on Twitter
                </Button>
              </Grid.Col>
            </React.Fragment>
          ),
        }}
      >
        {this.props.children}
      </Site.Wrapper>
    );
  }
}

export default SiteWrapper;
