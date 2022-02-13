import React from "react";
import { useState } from "react";
import { Button, Modal, Menu, Dropdown } from "antd";

import HistoryTrade from "./HistoryTrade/HistoryTrade";
import StockTools from "./StockTools/StockTools";
import StockTestBreak from "./StockTestBreak/StockTestBreak";
import StockMarketOverview from "./StockMarketOverview/StockMarketOverview";
import Note from '../Note/Note'
import { MoreOutlined } from '@ant-design/icons';

export default function Stock() {
    const [modal, setModal] = useState(null);

    const handleChangeMenu = (e: any) => {
        if (e.key === "tools") {
            setModal("StockTools")
        } else if (e.key === "historyTrade") {
            setModal("HistoryTrade")
        } else if (e.key === "testBreak") {
            setModal("StockTestBreak")
        }
    }

    const menu = <Menu onClick={handleChangeMenu}>
        <Menu.Item key="tools">
            Tools
        </Menu.Item>
        <Menu.Item key="historyTrade">
        History trade
        </Menu.Item>
        <Menu.Item key="testBreak">
            Test Break (Dev mode)
        </Menu.Item>
    </Menu>

    return <div style={{ background: "lightblue", height: "100%", overflow: "auto" }}>
        <div>
        <Dropdown overlay={menu} trigger={['click']}>
            <MoreOutlined />
        </Dropdown>
        </div>
        <div>
            <StockMarketOverview />
        </div>
        <Note title="stock" />
        {
            modal && <Modal className="custom-modal" visible={true} onCancel={() => setModal(null)} footer={null}>
                {modal === "HistoryTrade" && <HistoryTrade />}
                {modal === "StockTools" && <StockTools />}
                {modal === "StockTestBreak" && <StockTestBreak />}
            </Modal>
        }
    </div>
}
