// @flow

import * as React from "react";
import { Link } from "react-router-dom";

import { Avatar } from "../";

type Props = {|
  +href?: string,
  +src?: string,
  +alt?: string,
  +style?: Object,
|};

const SiteLogo = (props: Props): React.Node => (
  <Link to={props.href} className="header-brand">
    <img src={props.src} alt={props.alt} height="60px" width="auto"/>
  </Link>
);

SiteLogo.displayName = "Site.Logo";

export default SiteLogo;
