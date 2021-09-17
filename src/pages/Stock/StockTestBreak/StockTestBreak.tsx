import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Input, Table } from "antd";
import { mean, maxBy, minBy } from "lodash";

export default function StockTestBreak() {
    const [data, setData] = useState([]);
    const [symbol, setSymbol] = useState('KDH');


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
                limit: "1000",
            }
        })
        return res
    }

    const getData = async () => {
        const res = await getHistoricalQuotes(symbol, "2020-01-01", "2021-08-31")
        const xxx = res.data.map((i: any, index: number) => {
            if (index < res.data.length - 1) {
                const todayClose = i.priceClose
                const yesterdayClose = res.data[index + 1].priceClose
                i.priceChange = Number(((todayClose - yesterdayClose) / yesterdayClose * 100).toFixed(2))
            }

            // Condition 1
            let max = 0
            for (let j = 0; j < 20; j++) {
                if (res.data[index + j] && res.data[index + j].priceClose > max) {
                    max = res.data[index + j].priceClose
                }
            }

            // Condition 2
            let arrVolume = []
            for (let j = 0; j < 15; j++) {
                if (res.data[index + j]) {
                    arrVolume.push(res.data[index + j].totalVolume)
                }
            }
            i.volume15dayChange = Number(((i.totalVolume - mean(arrVolume)) / mean(arrVolume) * 100).toFixed(2))
            i.arrVolume = arrVolume

            // Condition 3
            let arr20day = []
            for (let j = 0; j < 20; j++) {
                if (res.data[index - j]) {
                    arr20day.push(res.data[index - j])
                }
            }

            i.highestPriceClose = maxBy(arr20day, "priceClose").priceClose
            i.highestPriceCloseDate = maxBy(arr20day, "priceClose").date
            i.highestChangePrice20day = Number(((i.highestPriceClose - i.priceClose) / i.priceClose * 100).toFixed(2))

            i.lowestPriceCloseDate = minBy(arr20day, "priceClose").date
            i.lowestPriceClose = minBy(arr20day, "priceClose").priceClose
            i.lowestChangePrice20day = Number(((i.lowestPriceClose - i.priceClose) / i.priceClose * 100).toFixed(2))


            i.diffInMonth = Number(((max - i.priceClose) / i.priceClose * 100).toFixed(2))
            const t3Price = res.data[index - 3]
            if (t3Price) {
                i.t3PriceClose = t3Price.priceClose
                i.t3Change = Number(((t3Price.priceClose - i.priceClose) / i.priceClose * 100).toFixed(2))
            }

            // if (i.priceChange && i.priceChange > 4) {
            // console.log(diffInMonth, max, i.priceClose, i.date)
            // }



            return i
        }).filter((i: any, index: number) => {
            return i.priceChange
                && i.priceChange > 4
                && i.volume15dayChange > 50
            // && i.t3Change > -3
        })
        // console.log(xxx, xxx.map((i: any) => i.priceChange))
        setData(xxx)

    }

    const handleChangeInput = (e: any) => {
        setSymbol(e.target.value)
    }

    const handlePressEnter = () => {
        getData()
    }

    useEffect(() => {
        getData();
    }, [])

    const columns = [
        {
            title: 'Date',
            render: (data: any) => {
                return moment(data.date).format('YYYY-MM-DD')
            }
        },
        {
            title: 'priceChange',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.priceChange
            }
        },
        {
            title: 'diffInMonth',
            align: 'right' as 'right',
            render: (data: any) => {
                return <div style={{
                    background: data.diffInMonth > 10 ? "red" : "white",
                    color: data.diffInMonth > 10 ? "white" : "black"
                }}>{data.diffInMonth}</div>
            }
        },
        {
            title: 'volume15dayChange',
            align: 'right' as 'right',
            render: (data: any) => {
                return <div style={{
                    background: data.volume15dayChange < 50 ? "red" : "white",
                    color: data.volume15dayChange < 50 ? "white" : "black"
                }}>{data.volume15dayChange} </div>
            }
        },
        {
            title: 't3Change',
            align: 'right' as 'right',
            render: (data: any) => {
                return <div style={{
                    background: data.t3Change < -3 ? "red" : "white",
                    color: data.t3Change < -3 ? "white" : "black"
                }}>{data.t3Change}</div>
            }
        },
        {
            title: 'highestChangePrice20day',
            align: 'right' as 'right',
            render: (data: any) => {
                return <div>{data.highestChangePrice20day} | {moment(data.highestPriceCloseDate).format("MM-DD")} </div>
            }
        },
        {
            title: 'lowestChangePrice20day',
            align: 'right' as 'right',
            render: (data: any) => {
                return <div style={{
                    background: data.lowestChangePrice20day < -5 ? "red" : "white",
                    color: data.lowestChangePrice20day < -5 ? "white" : "black"
                }}>{data.lowestChangePrice20day} | {moment(data.lowestPriceCloseDate).format("MM-DD")}</div>
            }
        }
    ]

    return <div>
        <ReactMarkdown>
            {`
                \n - Test break
                \n - Symbol: KDH
                \n - Time: 1/1/2020 - 31/12/2020
                \n - Condition test: 
                \n   - priceChange > 4%
                \n   - diffInMonth > 10%
                \n   - t3Change > -3%
                \n   - volume15dayChange > 50%

            `}
        </ReactMarkdown>
        <div>
            <Input onChange={handleChangeInput} onPressEnter={handlePressEnter} />Count: {data.length}
        </div>
        <div>
            <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                scroll={{ y: 800 }} />

        </div>
    </div >
}