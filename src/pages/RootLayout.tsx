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
import { withRouter, RouteComponentProps } from "react-router-dom";

interface IProps {

}

function RootLayout({ history }: IProps & RouteComponentProps) {
    // console.log(18, props)
    const [keyMenu, setKeyMenu] = useState("stock");

    const handleChangeMenu = (e: any) => {
        setKeyMenu(e.key)
    }

    // RENDER PART

    const renderMainContent = () => {
        if (keyMenu === "stock") {
            return <Stock />
        } else if (keyMenu === "todos") {
            return <Note id={3} />
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
                <Menu.Item key="todos">Todos</Menu.Item>
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



export default withRouter(RootLayout)