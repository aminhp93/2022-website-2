import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Nhi from './pages/Nhi/Nhi'

import ReactGridRoot from './pages/ReactGridRoot/ReactGridRoot'
import Stock from './pages/Stock/Stock'
import RootLayout from './pages/RootLayout/RootLayout'
import React from "react";

function App() {
  return (
    <div className="App">
      <div style={{ height: "100%" }}>
        <Switch>
          <Route path="/nhi">
            <Nhi />
          </Route>
          <Route path="/stock">
            <Stock />
          </Route>
          <Route path="/">
            <RootLayout />
          </Route>

          <Route path="/">
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
              </ul>
            </nav>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
