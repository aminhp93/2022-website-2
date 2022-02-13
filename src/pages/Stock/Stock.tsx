import React from "react";
import { useState } from "react";
import { Modal, Menu, Dropdown } from "antd";
import { MoreOutlined } from '@ant-design/icons';

import HistoryTrade from "./HistoryTrade/HistoryTrade";
import StockTools from "./StockTools/StockTools";
import StockTestBreak from "./StockTestBreak/StockTestBreak";
import StockMarketOverview from "./StockMarketOverview/StockMarketOverview";
import Note from '../Note/Note'
import StockEvent from "./StockEvent/StockEvent";
import StockNews from "./StockNews";


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

    return <div className="Stock">
        <div className="Stock-header">
            <div style={{ flex: 1 }}>Stock</div>
            <div style={{ width: "100px" }}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <MoreOutlined className="font-size-20" />
                </Dropdown>
            </div>
        </div>
        <div className="flex">
            <div style={{ flex: 1 }}>
                <StockMarketOverview />
            </div>
            <div style={{ flex: 1 }}>
                <StockEvent />
            </div>
            <div style={{ flex: 1 }}>
                <StockNews />
            </div>


        </div>

        {/* <Note title="stock" /> */}
        {
            modal && <Modal className="custom-modal" visible={true} onCancel={() => setModal(null)} footer={null}>
                {modal === "HistoryTrade" && <HistoryTrade />}
                {modal === "StockTools" && <StockTools />}
                {modal === "StockTestBreak" && <StockTestBreak />}
            </Modal>
        }
    </div>
}
