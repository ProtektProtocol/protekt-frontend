import React, { useState } from "react";
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

export const Web3Context = React.createContext({
  provider: {},
  updateProvider: () => {},
  updateAddress: () => {},
  ready: false,
  address: ''
});

function App(props: Props): React.Node {
  const [state, setState] = useState({
    provider: {},
    updateProvider: (_provider) => {
      setState((prevState) => {
        let temp = Object.assign({}, prevState); 
        temp.provider = _provider;
        temp.ready = true;
        return temp
      })
    },
    updateAddress: (_address) => {
      setState((prevState) => {
        let temp = Object.assign({}, prevState); 
        temp.address = _address;
        temp.updateAddress = () => {};
        return temp
      })
    }
  });

  return (
    <React.StrictMode>
      <Web3Context.Provider value={state}>
        <Router>
          <Switch>
            <Route exact path="/400" component={Error400} />
            <Route exact path="/401" component={Error401} />
            <Route exact path="/403" component={Error403} />
            <Route exact path="/404" component={Error404} />
            <Route exact path="/500" component={Error500} />
            <Route exact path="/503" component={Error503} />
            <Route exact path="/safe-yield" component={SafeYieldPage} />
            <Route exact path="/staking" component={StakingPage} />
            <Route exact path="/dashboard" component={DashboardPage} />
            <Redirect to='/safe-yield' />
            <Route component={Error404} />
          </Switch>
        </Router>
      </Web3Context.Provider>
    </React.StrictMode>
  );
}

export default App;
