import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { debounce } from "lodash";
import { Button, Modal, Input, notification } from "antd";

import HistoryTrade from "./HistoryTrade/HistoryTrade";
import StockTools from "./StockTools/StockTools";
import IndustryAndMarket from "./IndustryAndMarket/IndustryAndMarket";
import InvestmentStrategy from "./InvestmentStrategy/InvestmentStrategy";
import StockEvent from "./StockEvent/StockEvent";
import StockTestBreak from "./StockTestBreak/StockTestBreak";
import StockPattern from "./StockPattern/StockPattern";
import StockMarketOverview from "./StockMarketOverview/StockMarketOverview";
import StockBuyCheck from "./StockBuyCheck/StockBuyCheck";

const { TextArea } = Input

export default function Stock() {
    const [modal, setModal] = useState(null);
    const [note, setNote] = useState(`\n # Write something here for note`);
    const [editNote, setEditNote] = useState(false);

    const getStockNote = async () => {
        const res: any = await axios({
            url: "https://testapi.io/api/aminhp93/resource/note/1",
            data: {
                title: "stock",
                content: note
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            method: "GET"
        })
        if (res && res.data && res.data.content) {
            setNote(res.data.content)
        }
    }

    useEffect(() => {
        getStockNote();
    }, [])

    const handleChangeNote = (e: any) => {
        debounnceHandleChangeNote(e.target.value)
    }

    const debounnceHandleChangeNote = useCallback(debounce((value) => {
        if (value) {
            axios({
                url: "https://testapi.io/api/aminhp93/resource/note/1",
                data: {
                    title: "stock",
                    content: value
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                method: "PUT"
            }).then(res => {
                // console.log(res)
            }).catch(error => {
                notification.error({ message: "Error Update Note" })
            })
        }
        setNote(value)

    }, 1000), [])

    return <div style={{ background: "lightblue", height: "100%", overflow: "auto" }} onMouseDown={e => e.stopPropagation()}>
        <div>
            <StockMarketOverview />
        </div>
        <div style={{ textAlign: "start" }}>
            <Button onClick={() => setEditNote(!editNote)}>
                {editNote ? 'Edit' : 'Not edit'}
            </Button>
            {editNote
                ? <TextArea
                    // onPressEnter={() => setEditNote(false)}
                    defaultValue={note} onChange={handleChangeNote} />
                : <ReactMarkdown children={note} />
            }
        </div>

        <div className="flex" >
            <div style={{ flex: 1 }}>
                <div>Working</div>
                <Button onClick={() => setModal("HistoryTrade")}>History Trade</Button>
                <br />
                <Button onClick={() => setModal("StockTools")}>Stock Tools</Button>
                <br />
            </div>
            <div style={{ flex: 1 }}>
                <div>Developing</div>

                <Button onClick={() => setModal("IndustryAndMarket")}>IndustryAndMarket</Button>
                <br />
                <Button onClick={() => setModal("InvestmentStrategy")}>InvestmentStrategy</Button>
                <br />
                <Button onClick={() => setModal("StockEvent")}>Stock Event</Button>
                <br />
                <Button onClick={() => setModal("StockTestBreak")}>Test Break</Button>
                <br />
                <Button onClick={() => setModal("StockPattern")}>Stock Pattern</Button>
                <br />
                <Button onClick={() => setModal("StockBuyCheck")}>StockBuyCheck</Button>
            </div>
        </div>
        {
            modal && <Modal className="custom-modal" visible={true} onCancel={() => setModal(null)} footer={null}>
                {modal === "HistoryTrade" && <HistoryTrade />}
                {modal === "StockTools" && <StockTools />}
                {modal === "IndustryAndMarket" && <IndustryAndMarket />}
                {modal === "InvestmentStrategy" && <InvestmentStrategy />}
                {modal === "StockEvent" && <StockEvent />}
                {modal === "StockTestBreak" && <StockTestBreak />}
                {modal === "StockPattern" && <StockPattern />}
                {modal === "StockBuyCheck" && <StockBuyCheck />}
            </Modal>
        }
    </div>
}
