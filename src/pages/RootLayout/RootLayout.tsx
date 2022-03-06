import { useState } from "react";
import { Menu } from "antd";

import Stock from '../../pages/Stock/Stock'
import Note from '../Note/Note'
import SlateEditor from '../SlateExamples/markdown-preview'

export default function RootLayout() {
    const [keyMenu, setKeyMenu] = useState("stock");

    const handleChangeMenu = (e: any) => {
        setKeyMenu(e.key)
    }

    // RENDER PART

    const renderMainContent = () => {
        if (keyMenu === "stock") {
            return <Stock />
        } else if (keyMenu === "todos") {
            // return <Note title="todos" />
            return <SlateEditor />
        }
        return <div>Select menu to render content</div>
    }

    const renderSearch = () => {
        return <div className="RootLayout-search">Search</div>
    }

    const renderListMenu = () => {
        return <div className="RootLayout-list-menu">
            <Menu mode="inline" onClick={handleChangeMenu} selectedKeys={[keyMenu]}>
                <Menu.Item key="stock">Stock</Menu.Item>
                <Menu.Item key="todos">Todos</Menu.Item>
                <Menu.Item key="test">Test</Menu.Item>
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
