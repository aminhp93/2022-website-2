import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom'

import 'styles/index.less';

import store from 'store';

import { Switch, Route, Link, Redirect } from "react-router-dom";
import Nhi from 'pages/Nhi/Nhi'
import { useState } from "react";
import { Menu } from "antd";
import Stock from 'pages/Stock/Stock'
import NoteContainer from 'pages/NoteContainer'
import HouseFinance from 'pages/HouseFinance'
import Test from 'pages/Test'
import StoryTellerBusiness from 'pages/StoryTellerBusiness';

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
            <NoteContainer />
          </Route>
          <Route path="/" component={RootLayout} />
          <Redirect from="/" to='/' />
        </Switch>
      </div>
    </div>
  );
}


function RootLayout() {
  const [keyMenu, setKeyMenu] = useState("storyTellerBusiness");

  const handleChangeMenu = (e: any) => {
    setKeyMenu(e.key)
  }

  // RENDER PART

  const renderMainContent = () => {
    if (keyMenu === "stock") {
      return <Stock />
    } else if (keyMenu === "note") {
      return <NoteContainer />
    } else if (keyMenu === 'houseFinance') {
      return <HouseFinance />
    } else if (keyMenu === 'test') {
      return <Test />
    } else if (keyMenu === 'storyTellerBusiness') {
      return <StoryTellerBusiness />
    }
    // return <div>Select menu to render content</div>
    return null
  }

  const renderSearch = () => {
    return <div className="RootLayout-search">Search</div>
  }

  const renderListMenu = () => {
    return <div className="RootLayout-list-menu">
      <Menu mode="inline" onClick={handleChangeMenu} selectedKeys={[keyMenu]}>
        <Menu.Item key="note">Note</Menu.Item>
        <Menu.Item key="stock">Stock</Menu.Item>
        <Menu.Item key="houseFinance">Finance</Menu.Item>
        <Menu.Item key="storyTellerBusiness">Business</Menu.Item>
        <Menu.Item key="test">Test</Menu.Item>
      </Menu>
    </div>
  }

  const renderLeftContainer = () => {
    return <div className="RootLayout-left-container" >
      {renderListMenu()}
      {renderSearch()}
    </div>
  }

  const renderRightContainer = () => {
    return <div className="RootLayout-right-container" >
      <div className="RootLayout-main-content">
        {renderMainContent()}
      </div>
    </div>
  }

  return <div className="RootLayout">
    {renderLeftContainer()}
    {renderRightContainer()}
  </div>
}
