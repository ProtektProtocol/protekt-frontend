// @flow

import * as React from "react";

import DefaultErrorPage from "../components/tablerReactAlt/src/page_templates/errors/DefaultErrorPage.react";

type Props = {||};

function WaitingDeFiTrain({
  title = "🚂",
  subtitle = "The DeFi Train will be pulling into the station soon...",
  details = "$CHOO",
  action = "You're not ready"
}: DefaultErrorProps): React.Node {
  return (
    <DefaultErrorPage
      title={title}
      subtitle={subtitle}
      details={details}
      action={action}
    />
  );
}

export default WaitingDeFiTrain;