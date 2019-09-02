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
  Empty,
  ProfilePage,
} from "./pages";

import DefiPage from "./components/DefiPage.react";
import AboutPage from "./components/AboutPage.react";
import StablecoinReportPage from "./components/StablecoinReportPage.react";

import "tabler-react/dist/Tabler.css";

type Props = {||};

function App(props: Props): React.Node {
  return (
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path=`process.env.PUBLIC_URL${}` component={DefiPage} />
          <Route path=`process.env.PUBLIC_URL${"/defi"}` component={DefiPage} />
          <Route path=`process.env.PUBLIC_URL${"/about"}` component={AboutPage} />
          <Route path=`process.env.PUBLIC_URL${"/stable"}` component={StablecoinReportPage} />
          <Route path=`process.env.PUBLIC_URL${"/forgot-password"}` component={ForgotPasswordPage} />
          <Route path=`process.env.PUBLIC_URL${"/login"}` component={LoginPage} />
          <Route path=`process.env.PUBLIC_URL${"/profile"}` component={ProfilePage} />
          <Route path=`process.env.PUBLIC_URL${"/register"}` component={RegisterPage} />
          <Route path=`process.env.PUBLIC_URL${"/400"}` component={Error400} />
          <Route path=`process.env.PUBLIC_URL${"/401"}` component={Error401} />
          <Route path=`process.env.PUBLIC_URL${"/403"}` component={Error403} />
          <Route path=`process.env.PUBLIC_URL${"/404"}` component={Error404} />
          <Route path=`process.env.PUBLIC_URL${"/500"}` component={Error500} />
          <Route path=`process.env.PUBLIC_URL${"/503"}` component={Error503} />
          <Route component={Error404} />
        </Switch>
      </Router>
    </React.StrictMode>
  );
}

export default App;
