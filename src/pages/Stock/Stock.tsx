import axios from "axios";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cloneDeep, groupBy } from "lodash";
import { Button } from "antd";

import HistoryTrade from "../HistoryTrade/HistoryTrade";
import { LIST_SYMBOLS } from "./Stock.constants";

export default function Stock() {
    const [modal, setModal] = useState(null);
    const [listSymbols, setListSymbol] = useState(LIST_SYMBOLS)

    const mdChildren = `
        \n - Chứng khoán: SSI, VCI, VND, SHS
        \n - Công nghệ: FPT, ELC, CMG
        \n - Đầu tư công: HT1, BCC, KSB, PLC, FCN, LCG, C4G, HHV, G36
        \n - Cảng biển: HAH, GMD, PHP
        \n - Bán lẻ: MWG, FPT, DGW, VNM, MSN
        \n - Thép: HPG, HSG, NKG, SMC
        \n - Năng lượng: REE, PPC
        \n - Bank, BDS: chỉ mua thi giảm thật sâu
    `

    const getHistoricalQuotes = async (symbol: string, startDate: string, endDate: string) => {
        if (!startDate || !endDate) return
        const res = await axios({
            url: `https://restv2.fireant.vn/symbols/${symbol}/historical-quotes`,
            method: 'GET',
            headers: {
                Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxODg5NjIyNTMwLCJuYmYiOjE1ODk2MjI1MzAsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsiYWNhZGVteS1yZWFkIiwiYWNhZGVteS13cml0ZSIsImFjY291bnRzLXJlYWQiLCJhY2NvdW50cy13cml0ZSIsImJsb2ctcmVhZCIsImNvbXBhbmllcy1yZWFkIiwiZmluYW5jZS1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImludmVzdG9wZWRpYS1yZWFkIiwib3JkZXJzLXJlYWQiLCJvcmRlcnMtd3JpdGUiLCJwb3N0cy1yZWFkIiwicG9zdHMtd3JpdGUiLCJzZWFyY2giLCJzeW1ib2xzLXJlYWQiLCJ1c2VyLWRhdGEtcmVhZCIsInVzZXItZGF0YS13cml0ZSIsInVzZXJzLXJlYWQiXSwianRpIjoiMjYxYTZhYWQ2MTQ5Njk1ZmJiYzcwODM5MjM0Njc1NWQifQ.dA5-HVzWv-BRfEiAd24uNBiBxASO-PAyWeWESovZm_hj4aXMAZA1-bWNZeXt88dqogo18AwpDQ-h6gefLPdZSFrG5umC1dVWaeYvUnGm62g4XS29fj6p01dhKNNqrsu5KrhnhdnKYVv9VdmbmqDfWR8wDgglk5cJFqalzq6dJWJInFQEPmUs9BW_Zs8tQDn-i5r4tYq2U8vCdqptXoM7YgPllXaPVDeccC9QNu2Xlp9WUvoROzoQXg25lFub1IYkTrM66gJ6t9fJRZToewCt495WNEOQFa_rwLCZ1QwzvL0iYkONHS_jZ0BOhBCdW9dWSawD6iF1SIQaFROvMDH1rg'
            },
            params: {
                startDate,
                endDate,
                offset: "0",
                limit: "20",
            }
        })
        if (res && res.data && res.data.length) return res.data[0]
        return null
    }

    const getData = async () => {

        const listPromises: any = []
        const listPromises2: any = []


        listSymbols.map((i: any) => {
            i.data.map((j: any) => {
                listPromises.push(getHistoricalQuotes(j.symbol, '2021-07-19', '2021-07-19'))
                listPromises2.push(getHistoricalQuotes(j.symbol, '2021-08-27', '2021-08-27'))
            })

        })

        const res1 = await Promise.all(listPromises)
        const res2 = await Promise.all(listPromises2)

        if (res1 && res2 && res1.length && res2.length && res1.length === res2.length) {
            const res1Obj: any = groupBy(res1, 'symbol')
            const res2Obj: any = groupBy(res2, 'symbol')
            // console.log(res1Obj, res2Obj)
            const newList: any = [];
            Object.keys(res1Obj).map(i => {
                const item: any = {};
                item.symbol = i
                item.value = Number(((res2Obj[i][0].priceClose - res1Obj[i][0].priceClose) / res1Obj[i][0].priceClose * 100).toFixed(0))
                newList.push(item)
            })
            const newListObj = groupBy(newList, 'symbol')
            // console.log(newList)
            const cloneListSymbols = cloneDeep(listSymbols)
            cloneListSymbols.map((i: any) => {
                i.data.map((j: any) => {
                    j.value = newListObj[j.symbol][0].value
                })
            })
            // console.log(cloneListSymbols)
            setListSymbol(cloneListSymbols)
        }


    }

    useEffect(() => {
        getData();
    }, [])

    return <div style={{ background: "lightblue", height: "100%" }}>
        <div style={{ textAlign: "start" }}>
            <ReactMarkdown children={mdChildren} />
        </div>
        <div>{`% tang tu day 19/7/2021`}</div>
        <div style={{ display: "flex", overflow: "auto" }} >
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
                        {/* <Legend /> */}
                        <Bar label dataKey="value" fill="#8884d8" barSize={10} />
                    </BarChart>
                })
            }

        </div>
        <div>
            <Button onClick={() => setModal("HistoryTrade")}>History Trade</Button>
        </div>
        {modal === "HistoryTrade" && <HistoryTrade onClose={() => setModal(null)} />}
    </div>
}
