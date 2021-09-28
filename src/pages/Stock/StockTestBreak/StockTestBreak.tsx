
import { useEffect, useState } from "react";
import { Tabs } from "antd";

import StockTestBreak_TestTab from "./StockTestBreak_TestTab"
import StockTestBreak_GraphsTab from "./StockTestBreak_GraphsTab"
import StockTestBreak_ScoreboardTab from "./StockTestBreak_ScoreboardTab"
import StockTestBreak_OverviewTab from "./StockTestBreak_OverviewTab"

const { TabPane } = Tabs;

export default function StockTestBreak() {
    const [tab, setTab] = useState("overview");

    return <div>
        <div>
            <Tabs defaultActiveKey="overview" onChange={(key) => setTab(key)}>
                <TabPane tab="Overview" key="overview" />
                <TabPane tab="Scoreboard" key="scoreboard" />
                <TabPane tab="Graphs" key="graphs" />
                <TabPane tab="Test" key="test" />
            </Tabs>
        </div>
        {tab === "overview" && <StockTestBreak_OverviewTab />}
        {tab === "scoreboard" && <StockTestBreak_ScoreboardTab />}
        {tab === "graphs" && <StockTestBreak_GraphsTab />}
        {tab === "test" && <StockTestBreak_TestTab />}
    </div >
}



