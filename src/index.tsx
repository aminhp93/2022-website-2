import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom'

import 'styles/index.less';

import store from 'store/store';

import { Switch, Route, Link } from "react-router-dom";
import Nhi from 'pages/Nhi/Nhi'
import Stock from 'pages/Stock/Stock'
import Test from 'pages/Test'
import Note from 'pages/Note'
import RootLayout from 'pages/RootLayout'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

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
          <Route path="/test">
            <Test />
          </Route>
          <Route path="/note">
            <Note />
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
