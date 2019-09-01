// @flow

import * as React from "react";

import { Page, Grid, BlogCard } from "tabler-react";
import SiteWrapper from "../SiteWrapper.react";

function DefiPage(): React.Node {
  return (
    <SiteWrapper>
      <Page.Content title="Top DeFi Resources">
        <Grid.Row cards deck>
          <Grid.Col sm={6} xl={4}>
            <BlogCard
              imgSrc={"./demo/photos/david-klaasen-54203-500.jpg"}
              imgAlt={"And this isn&#39;t my nose. This is a false one."}
              postHref={"#"}
              title={"And this isn't my nose. This is a false one."}
              description={
                "Look, my liege! The Knights Who Say Ni demand a sacrifice! …Are you suggesting that coconuts migr..."
              }
              profileHref={"./profile.html"}
              authorName={"Rose Bradley"}
              avatarImgSrc={"./demo/faces/female/18.jpg"}
              date={"3 days ago"}
            />
          </Grid.Col>
          <Grid.Col sm={6} xl={4}>
            <BlogCard
              imgSrc={"./demo/photos/david-marcu-114194-500.jpg"}
              imgAlt={"Well, I didn&#39;t vote for you."}
              postHref={"#"}
              title={"Well, I didn't vote for you."}
              description={
                "Well, we did do the nose. Why? Shut up! Will you shut up?! You don't frighten us, English pig-dog..."
              }
              profileHref={"./profile.html"}
              authorName={"Peter Richards"}
              avatarImgSrc={"./demo/faces/male/16.jpg"}
              date={"3 days ago"}
            />
          </Grid.Col>
          <Grid.Col sm={6} xl={4}>
            <BlogCard
              imgSrc={"./demo/photos/davide-cantelli-139887-500.jpg"}
              imgAlt={"How do you know she is a witch?"}
              postHref={"#"}
              title={"How do you know she is a witch?"}
              description={
                "Are you suggesting that coconuts migrate? No, no, no! Yes, yes. A bit. But she's got a wart. You ..."
              }
              profileHref={"./profile.html"}
              authorName={"Wayne Holland"}
              avatarImgSrc={"./demo/faces/male/26.jpg"}
              date={"3 days ago"}
            />
          </Grid.Col>
          <Grid.Col sm={6} xl={4}>
            <BlogCard
              imgSrc={"./demo/photos/dino-reichmuth-84359-500.jpg"}
              imgAlt={"Shut up!"}
              postHref={"#"}
              title={"Shut up!"}
              description={
                "Burn her! How do you know she is a witch? You don't frighten us, English pig-dogs! Go and boil yo..."
              }
              profileHref={"./profile.html"}
              authorName={"Michelle Ross"}
              avatarImgSrc={"./demo/faces/female/7.jpg"}
              date={"3 days ago"}
            />
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  );
}

export default DefiPage;
