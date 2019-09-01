//@flow

import * as React from "react";
import { Card, Icon } from "tabler-react";

type Props = {|
  +children?: React.Node,
  +title?: string,
  +titleUrl?: string,
  +description?: string,
  +date?: string,
  +imgUrl?: string,
  +imgSrc?: string,
  +imgAlt?: string,
  +aside?: boolean,
  +postHref?: string,
|};

function ResourceCard({
  children,
  title,
  description,
  imgUrl,
  imgAlt,
  aside,
  date,
  imgSrc = "",
  postHref,
}: Props): React.Node {
  return (
    <Card>
      <a href={postHref} target="_blank">
        <img className="card-img-top" src={imgSrc} alt={imgAlt} />
      </a>
      <Card.Body className="d-flex flex-column">
        <h4>
          <a href={postHref} target="_blank">{title}</a>
        </h4>
        <div>{description}</div>
      </Card.Body>
    </Card>
  );
}

/** @component */
export default ResourceCard;
