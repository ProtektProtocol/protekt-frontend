import * as React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  Error400,
  Error401,
  Error403,
  Error404,
  Error500,
  Error503,
  ProfilePage,
} from "./pages";

import DefiPage from "./components/DefiPage.react";
import AboutPage from "./components/AboutPage.react";
import YieldProtocolPage from "./components/YieldProtocolPage.react";
import BalancerLeaderboardPage from "./components/BalancerLeaderboardPage.react";
import UpdateBalancerPage from "./components/UpdateBalancerPage.react";
import AddressPage from "./components/AddressPage.react";

import "tabler-react/dist/Tabler.css";

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
          <Route exact path="/defi" component={DefiPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/yield" component={YieldProtocolPage} />
          <Route exact path="/balancer" component={BalancerLeaderboardPage} />
          <Route exact path="/balancer/update" component={UpdateBalancerPage} />
          <Route exact path="/address/:addr" component={AddressPage} />
          <Route exact path="/forgot-password" component={ForgotPasswordPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route exact path="/register" component={RegisterPage} />
          <Redirect to='/yield' />
          <Route component={Error404} />
        </Switch>
      </Router>
    </React.StrictMode>
  );
}

export default App;
