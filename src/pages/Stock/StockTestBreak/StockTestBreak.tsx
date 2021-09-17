import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Input } from "antd";

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
        const res = await getHistoricalQuotes(symbol, "2020-01-01", "2021-12-31")
        const xxx = res.data.map((i: any, index: number) => {
            if (index < res.data.length - 1) {
                const todayClose = i.priceClose
                const yesterdayClose = res.data[index + 1].priceClose
                i.priceChange = Number(((todayClose - yesterdayClose) / yesterdayClose * 100).toFixed(2))
            }

            let max = 0
            for (let j = 0; j < 20; j++) {
                if (res.data[index + j] && res.data[index + j].priceClose > max) {
                    max = res.data[index + j].priceClose
                }
            }

            i.diffInMonth = Number(((max - i.priceClose) / i.priceClose * 100).toFixed(2))
            if (i.priceChange && i.priceChange > 4) {
                // console.log(diffInMonth, max, i.priceClose, i.date)
            }

            return i
        }).filter((i: any, index: number) => {
            return i.priceChange && i.priceChange > 4
        })
        console.log(xxx, xxx.map((i: any) => i.priceChange))
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

    return <div>
        <ReactMarkdown>
            {`
                \n - Test break
                \n - Symbol: KDH
                \n - Time: 1/1/2020 - 31/12/2020
                \n - Test sample: All date with % change > 4%
            `}
        </ReactMarkdown>
        <div>
            <Input onChange={handleChangeInput} onPressEnter={handlePressEnter} />Count: {data.length}
        </div>
        <div>
            {data.map((i: any) => {
                return <div>
                    <span style={{ marginRight: "20px" }}>{moment(i.date).format('YYYY-MM-DD')}</span>
                    <span style={{ marginRight: "20px" }}>{i.priceChange}</span>
                    <span style={{ color: i.diffInMonth < 10 ? "black" : "red" }}>{i.diffInMonth}</span>
                </div>
            })}
        </div>
    </div >
}