// @flow

import * as React from "react";

import DefaultErrorPage from "../components/tablerReactAlt/src/page_templates/errors/DefaultErrorPage.react";

type Props = {||};

function WaitingDeFiTrain({
  subtitle = "The DeFi Train will be pulling into the station soon...",
  details = "$CHOO",
  action = "You're not ready"
}: DefaultErrorProps): React.Node {
  return (
    <DefaultErrorPage
      img={(
        <div>
          <img style={{maxHeight: '150px'}} className="mb-2" src={`static/logo-train-long-no-title.png`} alt={`DeFi Train Logo`} />
        </div>)}
      subtitle={subtitle}
      details={details}
      action={action}
    />
  );
}

export default WaitingDeFiTrain;