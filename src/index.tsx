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
import Note from 'pages/Note'
import HouseFinance from 'pages/HouseFinance'
import Test from 'pages/Test'
// import SlateEditor from '../SlateExamples/markdown-preview'
// import SlateEditor from '../SlateExamples/_using_version'
import SlateEditor from 'pages/SlateExamples/richtext'
import InsightOutsourcing from 'pages/InsightOutsourcing'
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
            <Note />
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
      return <Note management title="todos" />
    } else if (keyMenu === "insightOutsourcing") {
      return <InsightOutsourcing />
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
        <Menu.Item key="stock">Stock</Menu.Item>
        <Menu.Item key="note">Note management</Menu.Item>
        <Menu.Item key="insightOutsourcing">Insight outsourcing</Menu.Item>
        <Menu.Item key="test">Test</Menu.Item>
        <Menu.Item key="houseFinance">HousingFinance</Menu.Item>
        <Menu.Item key="storyTellerBusiness">StoryTellerBusiness</Menu.Item>
      </Menu>
    </div>
  }

  const renderLeftContainer = () => {
    return <div className="RootLayout-left-container" >
      {renderSearch()}
      {renderListMenu()}
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
