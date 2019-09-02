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
  console.log(this.props.location.pathname);
  console.log(this.props)


  return (
    <React.StrictMode>
      <Router>
        <Switch>
          <Route exact path="/" component={DefiPage} />
          <Route path="/400" component={Error400} />
          <Route path="/401" component={Error401} />
          <Route path="/403" component={Error403} />
          <Route path="/404" component={Error404} />
          <Route path="/500" component={Error500} />
          <Route path="/503" component={Error503} />
          <Route path="/defi" component={DefiPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/stable" component={StablecoinReportPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/register" component={RegisterPage} />
          <Route component={Error404} />
        </Switch>
      </Router>
    </React.StrictMode>
  );
}

export default App;
