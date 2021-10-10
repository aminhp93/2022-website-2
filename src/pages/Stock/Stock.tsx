import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
// import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import {
    keyBy,
    debounce
} from "lodash";
import { Button, Modal, Input, notification } from "antd";

import HistoryTrade from "./HistoryTrade/HistoryTrade";
import StockTools from "./StockTools/StockTools";
import IndustryAndMarket from "./IndustryAndMarket/IndustryAndMarket";
import InvestmentStrategy from "./InvestmentStrategy/InvestmentStrategy";
import StockEvent from "./StockEvent/StockEvent";
import StockTestBreak from "./StockTestBreak/StockTestBreak";
import StockPattern from "./StockPattern/StockPattern";

// import { LIST_SYMBOLS } from "./Stock.constants";

const { TextArea } = Input

export default function Stock() {
    const [modal, setModal] = useState(null);
    const [note, setNote] = useState(`\n # Write something here for note`);
    const [editNote, setEditNote] = useState(false);

    // const [listSymbols, setListSymbol] = useState(LIST_SYMBOLS)

    // const getHistoricalQuotes = async (symbol: string, startDate: string, endDate: string) => {
    //     if (!startDate || !endDate) return
    //     const res = await axios({
    //         url: `https://restv2.fireant.vn/symbols/${symbol}/historical-quotes`,
    //         method: 'GET',
    //         headers: {
    //             Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxODg5NjIyNTMwLCJuYmYiOjE1ODk2MjI1MzAsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsiYWNhZGVteS1yZWFkIiwiYWNhZGVteS13cml0ZSIsImFjY291bnRzLXJlYWQiLCJhY2NvdW50cy13cml0ZSIsImJsb2ctcmVhZCIsImNvbXBhbmllcy1yZWFkIiwiZmluYW5jZS1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImludmVzdG9wZWRpYS1yZWFkIiwib3JkZXJzLXJlYWQiLCJvcmRlcnMtd3JpdGUiLCJwb3N0cy1yZWFkIiwicG9zdHMtd3JpdGUiLCJzZWFyY2giLCJzeW1ib2xzLXJlYWQiLCJ1c2VyLWRhdGEtcmVhZCIsInVzZXItZGF0YS13cml0ZSIsInVzZXJzLXJlYWQiXSwianRpIjoiMjYxYTZhYWQ2MTQ5Njk1ZmJiYzcwODM5MjM0Njc1NWQifQ.dA5-HVzWv-BRfEiAd24uNBiBxASO-PAyWeWESovZm_hj4aXMAZA1-bWNZeXt88dqogo18AwpDQ-h6gefLPdZSFrG5umC1dVWaeYvUnGm62g4XS29fj6p01dhKNNqrsu5KrhnhdnKYVv9VdmbmqDfWR8wDgglk5cJFqalzq6dJWJInFQEPmUs9BW_Zs8tQDn-i5r4tYq2U8vCdqptXoM7YgPllXaPVDeccC9QNu2Xlp9WUvoROzoQXg25lFub1IYkTrM66gJ6t9fJRZToewCt495WNEOQFa_rwLCZ1QwzvL0iYkONHS_jZ0BOhBCdW9dWSawD6iF1SIQaFROvMDH1rg'
    //         },
    //         params: {
    //             startDate,
    //             endDate,
    //             offset: "0",
    //             limit: "20",
    //         }
    //     })
    //     if (res && res.data && res.data.length) return res.data[0]
    //     return null
    // }

    // const getData = async () => {

    //     const listPromises: any = []
    //     const listPromises2: any = []


    //     listSymbols.map((i: any) => {
    //         i.data.map((j: any) => {
    //             listPromises.push(getHistoricalQuotes(j.symbol, '2021-07-19', '2021-07-19'))
    //             listPromises2.push(getHistoricalQuotes(j.symbol, '2021-08-27', '2021-08-27'))
    //         })

    //     })

    //     const res1 = await Promise.all(listPromises)
    //     const res2 = await Promise.all(listPromises2)

    //     if (res1 && res2 && res1.length && res2.length && res1.length === res2.length) {
    //         const res1Obj: any = groupBy(res1, 'symbol')
    //         const res2Obj: any = groupBy(res2, 'symbol')
    //         // console.log(res1Obj, res2Obj)
    //         const newList: any = [];
    //         Object.keys(res1Obj).map(i => {
    //             const item: any = {};
    //             item.symbol = i
    //             item.value = Number(((res2Obj[i][0].priceClose - res1Obj[i][0].priceClose) / res1Obj[i][0].priceClose * 100).toFixed(0))
    //             newList.push(item)
    //         })
    //         const newListObj = groupBy(newList, 'symbol')
    //         // console.log(newList)
    //         const cloneListSymbols = cloneDeep(listSymbols)
    //         cloneListSymbols.map((i: any) => {
    //             i.data.map((j: any) => {
    //                 j.value = newListObj[j.symbol][0].value
    //             })
    //         })
    //         // console.log(cloneListSymbols)
    //         setListSymbol(cloneListSymbols)
    //     }


    // }

    // const test = async () => {
    //     const res = await axios({
    //         url: "https://testapi.io/api/aminhp93/resource/stocks",
    //         data: {
    //             symbol: 'VCI',
    //             content: 'crazy',
    //         },
    //         headers: {
    //             'Content-type': 'application/json; charset=UTF-8',
    //         },
    //         method: "POST"
    //     })

    //     console.log(res)

    // }

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

    const [listWatchlists, setListWatchlists] = useState([])

    const getWatchlist = async () => {
        const res = await axios({
            method: "GET",
            url: "https://restv2.fireant.vn/me/watchlists",
            headers: {
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNjIzMDMyLCJuYmYiOjE2MTM2MjMwMzIsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM2MjMwMzIsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiZmIyZWJkNzAzNTBiMDBjMGJhMWE5ZDA5NGUwNDMxMjYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.OhgGCRCsL8HVXSueC31wVLUhwWWPkOu-yKTZkt3jhdrK3MMA1yJroj0Y73odY9XSLZ3dA4hUTierF0LxcHgQ-pf3UXR5KYU8E7ieThAXnIPibWR8ESFtB0X3l8XYyWSYZNoqoUiV9NGgvG2yg0tQ7lvjM8UYbiI-3vUfWFsMX7XU3TQnhxW8jYS_bEXEz7Fvd_wQbjmnUhQZuIVJmyO0tFd7TGaVipqDbRdry3iJRDKETIAMNIQx9miHLHGvEqVD5BsadOP4l8M8zgVX_SEZJuYq6zWOtVhlq3uink7VvnbZ7tFahZ4Ty4z8ev5QbUU846OZPQyMlEnu_TpQNpI1hg"
            }
        })
        if (res && res.data) {
            setListWatchlists(res.data)
        }
    }

    useEffect(() => {
        getWatchlist()
    }, [])

    useEffect(() => {
        // getData();
        // test();
        getStockNote();
    }, [])

    const objWatchlists = keyBy(listWatchlists, "name")
    const aimToBuyWatchlist = objWatchlists['aim_to_buy']
    // console.log(aimToBuyWatchlist)

    const aimToBuyDataSource = aimToBuyWatchlist && aimToBuyWatchlist.symbols && aimToBuyWatchlist.symbols.map((i: any) => {
        return {
            symbol: i
        }
    })

    const aimToBuyColumns = [
        {
            title: 'Symbol',
            render: (data: any) => {
                return data.symbol
            }
        }
    ]

    const handleChangeNote = (e: any) => {
        // console.log(e.target.value)
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
        {/* <div>{`% tang tu day 19/7/2021`}</div> */}

        {/* <div style={{ height: "400px", overflow: "auto" }}>
            {aimToBuyWatchlist && <Table size="small" dataSource={aimToBuyDataSource} columns={aimToBuyColumns} pagination={false} />}
        </div> */}
        {/* <div style={{ display: "flex", overflow: "auto" }} >
            {
                listSymbols.map((i: any) => {
                    return <BarChart
                        width={i.data.length * 80}
                        height={300}
                        data={i.data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="symbol" />
                        <YAxis />
                        <ReferenceLine y={0} stroke="#000" />
                        <Tooltip />
                        <Bar label dataKey="value" fill="#8884d8" barSize={10} />
                    </BarChart>
                })
            }

        </div> */}

        <Button onClick={() => setModal("HistoryTrade")}>History Trade</Button>
        <br />
        <Button onClick={() => setModal("StockTools")}>Stock Tools</Button>
        <br />
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
        {
            modal && <Modal className="custom-modal" visible={true} onCancel={() => setModal(null)} footer={null}>
                {modal === "HistoryTrade" && <HistoryTrade />}
                {modal === "StockTools" && <StockTools />}
                {modal === "IndustryAndMarket" && <IndustryAndMarket />}
                {modal === "InvestmentStrategy" && <InvestmentStrategy />}
                {modal === "StockEvent" && <StockEvent />}
                {modal === "StockTestBreak" && <StockTestBreak />}
                {modal === "StockPattern" && <StockPattern />}
            </Modal>
        }
    </div>
}
