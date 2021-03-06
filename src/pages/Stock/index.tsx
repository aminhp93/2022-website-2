import { useState } from "react";
import { Modal, Menu, Dropdown, Button } from "antd";
import { MoreOutlined } from '@ant-design/icons';

import StockHistoryTrade from "pages/Stock/StockHistoryTrade";
import StockTools from "pages/Stock/StockTools";
import StockMarketOverview from "pages/Stock/StockMarketOverview";
import StockEvent from "pages/Stock/StockEvent";
import StockNews from "pages/Stock/StockNews";
import StockAnalysis from "pages/Stock/StockAnalysis";


export default function Stock() {
    const [modal, setModal] = useState(null);
    const [showStockMarketOverview, setShowStockMarketOverview] = useState(true);
    const [showStockEvent, setShowStockEvent] = useState(false);
    const [showStockNews, setShowStockNews] = useState(true);
    const [showStockAnalysis, setShowStockAnalysis] = useState(false);

    const handleChangeMenu = (e: any) => {
        if (e.key === "tools") {
            setModal("StockTools")
        } else if (e.key === "stockHistoryTrade") {
            setModal("StockHistoryTrade")
        }
    }

    const menu = <Menu onClick={handleChangeMenu}>
        <Menu.Item key="tools">
            Tools
        </Menu.Item>
        <Menu.Item key="stockHistoryTrade">
            Stock History trade
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

            {
                showStockAnalysis && <div style={{ flex: 1 }}>
                    <StockAnalysis />
                </div>
            }

        </div>
        <div className="flex" style={{ background: 'gray' }}>
            <Button type={showStockMarketOverview ? "primary" : null} onClick={() => setShowStockMarketOverview(!showStockMarketOverview)}>StockMarketOverview</Button>
            <Button type={showStockEvent ? "primary" : null} onClick={() => setShowStockEvent(!showStockEvent)}>StockEvent</Button>
            <Button type={showStockNews ? "primary" : null} onClick={() => setShowStockNews(!showStockNews)}>StockNews</Button>
            <Button type={showStockAnalysis ? "primary" : null} onClick={() => setShowStockAnalysis(!showStockAnalysis)}>StockAnalysis</Button>
        </div>
        {
            modal && <Modal centered className="custom-modal" visible={true} onCancel={() => setModal(null)} footer={null}>
                {modal === "StockHistoryTrade" && <StockHistoryTrade />}
                {modal === "StockTools" && <StockTools />}
            </Modal>
        }
    </div>
}
