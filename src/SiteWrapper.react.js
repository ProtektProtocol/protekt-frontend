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

import Site from "./components/tablerReactAlt/src/components/Site";

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
    value: "Safe Yield",
    to: "/safe-yield",
    icon: "trending-up",
    LinkComponent: withRouter(NavLink),
  },
  {
    value: "Staking",
    to: "/defi",
    icon: "shield",
    LinkComponent: withRouter(NavLink),
  },
  {
    value: "Your Dashboard",
    to: "/defi",
    icon: "layout",
    LinkComponent: withRouter(NavLink),
  },
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
          alt: "DeFi Fam",
          imageURL: `${process.env.PUBLIC_URL}/static/logo_protekt.png`,
          navItems: [
            (
              <Nav.Item type="div" className="d-flex" key={1}>
                <List className="list-inline list-inline-dots mb-0 d-none d-md-flex">
                  <List.Item className="list-inline-item">
                    <a href="https://docs.protektprotocol.com" target="_blank" rel="noopener noreferrer">Documentation</a>
                  </List.Item>
                </List>
              </Nav.Item>
            ),
            (
              <Nav.Item type="div" className="d-flex" key={2}>
                <Button
                  href="https://twitter.com/protektprotocol"
                  target="_blank"
                  size="md"
                  outline
                  color="primary"
                  RootComponent="a"
                  className="d-none d-md-flex"
                >
                  Connect Wallet
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
              Copyright © 2020
              <a href="https://twitter.com/DeFiWhale" target="_blank" rel="noopener noreferrer"> DeFi Whale</a>. All rights reserved.
            </React.Fragment>
          ),
          nav: (
            <React.Fragment>
              <Grid.Col auto={true} className="d-flex">
                <List className="list-inline list-inline-dots mb-0 d-none d-md-flex">
                  <List.Item className="list-inline-item">
                    <Link to="/about">About</Link>
                  </List.Item>
                </List>
              </Grid.Col>
              <Grid.Col auto={true} className="d-flex">
                <Button
                  href="https://twitter.com/DeFiWhale"
                  target="_blank"
                  size="md"
                  outline
                  color="primary"
                  RootComponent="a"
                  className="d-none d-md-flex"
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
