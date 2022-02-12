import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import MDEditor from '@uiw/react-md-editor';

import { Button, Modal, Input, notification, Layout, Menu } from "antd";


import HistoryTrade from "./HistoryTrade/HistoryTrade";
import StockTools from "./StockTools/StockTools";
import StockTestBreak from "./StockTestBreak/StockTestBreak";
import StockMarketOverview from "./StockMarketOverview/StockMarketOverview";
import React from "react";

const { TextArea } = Input



export default function Stock() {
    const [modal, setModal] = useState(null);
    const [note, setNote] = useState(`\n # Write something here for note`);
    const [tempNote, setTempNote] = useState(null)
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
        const value = String(e.target.value.trim());
        if (value) {
            setTempNote(value)
        }
    }

    const handleConfirmNote = () => {
        let content
        if (!tempNote) {
            content = `\n # Write something here for note`
        } else {
            content = tempNote
        }


        axios({
            url: "https://testapi.io/api/aminhp93/resource/note/1",
            data: {
                title: "stock",
                content
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
        setTempNote(null)
        setNote(content)
        setEditNote(false)
    }

    const handleCancelNote = () => {
        setTempNote(null)
        setEditNote(false)
    }

    return <div style={{ background: "lightblue", height: "100%", overflow: "auto" }} onMouseDown={e => e.stopPropagation()}>
        <div>
            <StockMarketOverview />
        </div>
        <div style={{ textAlign: "start" }}>
            {
                editNote
                    ? <>
                        <Button onClick={handleConfirmNote}>
                            Confirm
            </Button>
                        <Button onClick={handleCancelNote}>
                            Cancel
            </Button>
                    </>
                    : <Button onClick={() => setEditNote(true)}>
                        Edit
            </Button>
            }

            {editNote
                ? <TextArea
                    // onPressEnter={() => setEditNote(false)}
                    defaultValue={note} onChange={handleChangeNote} />
                : <MDEditor.Markdown source={note} />


            }
        </div>

        <div className="flex" >
            <div style={{ flex: 1 }}>
                <Button onClick={() => setModal("HistoryTrade")}>History Trade</Button>
                <br />
                <Button onClick={() => setModal("StockTools")}>Stock Tools</Button>
                <br />
            </div>
            <div style={{ flex: 1 }}>
                <Button onClick={() => setModal("StockTestBreak")}>Test Break (Dev mode)</Button>
            </div>
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
