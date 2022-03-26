import React from "react";
import { useState } from "react";
import { Modal, Menu, Dropdown, Button } from "antd";
import { MoreOutlined } from '@ant-design/icons';

import HistoryTrade from "./HistoryTrade/HistoryTrade";
import StockTools from "./StockTools/StockTools";
import StockTestBreak from "./StockTestBreak/StockTestBreak";
import StockMarketOverview from "./StockMarketOverview/StockMarketOverview";
import StockEvent from "./StockEvent/StockEvent";
import StockNews from "./StockNews";


export default function Stock() {
    const [modal, setModal] = useState(null);
    const [showStockMarketOverview, setShowStockMarketOverview] = useState(true);
    const [showStockEvent, setShowStockEvent] = useState(false);
    const [showStockNews, setShowStockNews] = useState(true);

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
            <div className="Stock-header-menu" >
                <Dropdown overlay={menu} trigger={['click']}>
                    <MoreOutlined className="font-size-30 color-black" />
                </Dropdown>
            </div>
        </div>
        <div className="flex" style={{ flex: 1, overflow: "hidden" }}>
            {
                showStockMarketOverview && <div style={{ flex: 1 }}>
                    <StockMarketOverview />
                </div>
            }
            {
                showStockEvent && <div style={{ flex: 1 }}>
                    <StockEvent />
                </div>
            }
            {
                showStockNews && <div style={{ flex: 1 }}>
                    <StockNews />
                </div>
            }

        </div>
        <div className="flex" style={{ background: 'gray' }}>
            <Button type={showStockMarketOverview ? "primary" : null} onClick={() => setShowStockMarketOverview(!showStockMarketOverview)}>StockMarketOverview</Button>
            <Button type={showStockEvent ? "primary" : null} onClick={() => setShowStockEvent(!showStockEvent)}>StockEvent</Button>
            <Button type={showStockNews ? "primary" : null} onClick={() => setShowStockNews(!showStockNews)}>StockNews</Button>
        </div>
        {
            modal && <Modal className="custom-modal" visible={true} onCancel={() => setModal(null)} footer={null}>
                {modal === "HistoryTrade" && <HistoryTrade />}
                {modal === "StockTools" && <StockTools />}
                {modal === "StockTestBreak" && <StockTestBreak />}
            </Modal>
        }
    </div>
}
