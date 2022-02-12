import React from 'react';
import { useCallback, useEffect, useState } from "react";

import { Button, Modal, Input, notification, Layout, Menu } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import Stock from '../../pages/Stock/Stock'
import Todos from '../../pages/Todos/Todos'

const { Header, Footer, Sider, Content } = Layout;



export default function RootLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [keyMenu, setKeyMenu] = useState(null);

    const handleChangeMenu = (e: any) => {
        console.log(e)
        setKeyMenu(e.key)

    }

    // RENDER PART

    const renderMainContent = () => {
        if (keyMenu === "stock") {
            return <Stock />
        } else if (keyMenu === "todos") {
            return <Todos />
        }
        return <div>Select menu to render content</div>
    }

    const renderSearch = () => {
        return <div className="RootLayout-search">Search</div>
    }

    const renderListMenu = () => {
        return <div className="RootLayout-list-menu">
            <Menu mode="inline" onClick={handleChangeMenu}>
                <Menu.Item key="stock">Stock</Menu.Item>
                <Menu.Item key="todos">Todos</Menu.Item>
                <Menu.Item key="test">Test</Menu.Item>
            </Menu>
        </div>
    }

    const renderSetting = () => {
        return <div className="RootLayout-setting">renderSetting</div>
    }

    const renderTitle = () => {
        return <div className="RootLayout-title">renderTitle</div>
    }

    const renderLeftContainer = () => {
        return <div className="RootLayout-left-container" >
            {renderSearch()}
            {renderListMenu()}
            {renderSetting()}
        </div>
    }

    const renderRightContainer = () => {
        return <div className="RootLayout-right-container" >
            {renderTitle()}
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