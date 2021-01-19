import * as React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import {
  Error400,
  Error401,
  Error403,
  Error404,
  Error500,
  Error503,
} from "./pages";

import SafeYieldPage from "./pages/SafeYieldPage.react";
import StakingPage from "./pages/StakingPage.react";
import DashboardPage from "./pages/DashboardPage.react";

import "tabler-react/dist/Tabler.css";
import "./App.css";

type Props = {||};

function App(props: Props): React.Node {
  return (
    <React.StrictMode>
      <Router>
        <Switch>
          <Route exact path="/400" component={Error400} />
          <Route exact path="/401" component={Error401} />
          <Route exact path="/403" component={Error403} />
          <Route exact path="/404" component={Error404} />
          <Route exact path="/500" component={Error500} />
          <Route exact path="/503" component={Error503} />
          <Route exact path="/earn-yield" component={SafeYieldPage} />
          <Route exact path="/staking" component={StakingPage} />
          <Route exact path="/dashboard" component={DashboardPage} />
          <Redirect to='/earn-yield' />
          <Route component={Error404} />
        </Switch>
      </Router>
    </React.StrictMode>
  );
}

export default App;
