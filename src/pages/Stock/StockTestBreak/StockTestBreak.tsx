import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Input, Table, Button, Tabs, DatePicker, Select } from "antd";
import { mean, maxBy, minBy, meanBy, keyBy, sortBy } from "lodash";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { isConstructorDeclaration } from "typescript";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function StockTestBreak() {
    const [data, setData] = useState([]);
    const [tab, setTab] = useState("overview");

    const getHistoricalQuotes = async (symbol: string, startDate: string, endDate: string) => {
        if (!startDate || !endDate) return

        const res = await axios({
            url: "https://fwtapi1.fialda.com/api/services/app/StockInfo/GetHistoricalData",
            method: "GET",
            params: {
                symbol: symbol.toUpperCase(),
                fromDate: "2020-01-01T00:00:00.094",
                toDate: "2021-08-31T15:09:14.095",
                pageNumber: 1,
                pageSize: 1000
            }
        })
        return res.data.result.items
    }

    const getData = async (symbol: string) => {
        const res = await getHistoricalQuotes(symbol, "2020-01-01", "2021-08-31")
        const xxx = res.map((i: any, index: number) => {
            if (index < res.length - 1) {
                const todayClose = i.adjClose
                const yesterdayClose = res[index + 1].adjClose
                i.priceChange = Number(((todayClose - yesterdayClose) / yesterdayClose * 100).toFixed(2))
            }

            // Condition 1
            let max = 0
            for (let j = 0; j < 20; j++) {
                if (res[index + j] && res[index + j].adjClose > max) {
                    max = res[index + j].adjClose
                }
            }
            i.diffInMonth = Number(((max - i.adjClose) / i.adjClose * 100).toFixed(2))
            const t3Price = res[index - 3]
            if (t3Price) {
                i.t3PriceClose = t3Price.adjClose
                i.t3Change = Number(((t3Price.adjClose - i.adjClose) / i.adjClose * 100).toFixed(2))
            }

            // Condition 2
            let arrVolume = []
            for (let j = 0; j < 15; j++) {
                if (res[index + j]) {
                    arrVolume.push(res[index + j].totalDealVolume)
                }
            }
            i.volume15dayChange = Number(((i.totalDealVolume - mean(arrVolume)) / mean(arrVolume) * 100).toFixed(2))
            i.arrVolume = arrVolume

            // Condition 3
            let arr20day = []
            for (let j = 0; j < 20; j++) {
                if (res[index - j]) {
                    arr20day.push(res[index - j])
                }
            }

            i.highestPriceClose = maxBy(arr20day, "adjClose").adjClose
            i.highestPriceCloseDate = maxBy(arr20day, "adjClose").tradingTime
            i.highestChangePrice20day = Number(((i.highestPriceClose - i.adjClose) / i.adjClose * 100).toFixed(2))

            i.lowestPriceCloseDate = minBy(arr20day, "adjClose").tradingTime
            i.lowestPriceClose = minBy(arr20day, "adjClose").adjClose
            i.lowestChangePrice20day = Number(((i.lowestPriceClose - i.adjClose) / i.adjClose * 100).toFixed(2))

            // Condition 4
            if (res[index + 1]) {
                const previousDayChange = res[index + 1].changePercent
                i.previousDayChange = Number((previousDayChange * 100).toFixed(2))
            }
            i.tradingTime = moment(i.tradingTime).format("YYYY-MM-DD")

            return i
        }).filter((i: any, index: number) => {
            return i.priceChange
                && i.priceChange > 4
                && i.volume15dayChange > 50
                && i.previousDayChange < 4
                && i.open !== i.high
                && i.diffInMonth < 10
            // && i.t3Change > -3
        })
        const average = {
            date: "averageDate",
            highestChangePrice20day: Number(meanBy(xxx, 'highestChangePrice20day').toFixed(2))
        }
        xxx.push(average)
        setData(xxx)
    }

    return <div>
        <div>
            <Tabs defaultActiveKey="overview" onChange={(key) => setTab(key)}>
                <TabPane tab="Overview" key="overview" />
                <TabPane tab="Scoreboard" key="scoreboard" />
                <TabPane tab="Graphs" key="graphs" />
                <TabPane tab="Test" key="test" />
            </Tabs>
        </div>
        {tab === "overview" && <OverviewTab />}
        {tab === "scoreboard" && <ScoreboardTab cb={getData} data={data} />}
        {tab === "graphs" && <GraphsTab />}
        {tab === "test" && <TestTab />}
    </div >
}

function OverviewTab() {
    const [symbol, setSymbol] = useState("NKG");
    const [listSymbol, setListSymbol] = useState(['HPG', 'NKG', 'TLH', "HSG"]);
    const [startDate, setStartDate] = useState("2020-01-01");
    const [endDate, setEndDate] = useState("2020-12-31")
    const [data, setData] = useState([]);
    const [listData, setListData] = useState([]);
    const [listWatchlists, setListWatchlists] = useState([])
    const [showAll, setShowAll] = useState(false);

    const getData = async (symbol: string) => {
        const res = await getHistoricalQuotes(symbol, startDate, endDate)
        if (!res) {
            console.log(symbol)
            return { "hello": 123 }
        }
        const xxx = res.map((i: any, index: number) => {
            if (index < res.length - 1) {
                const todayClose = i.adjClose
                const yesterdayClose = res[index + 1].adjClose
                i.priceChange = Number(((todayClose - yesterdayClose) / yesterdayClose * 100).toFixed(2))
            }

            // Condition 1
            let max = 0
            for (let j = 0; j < 20; j++) {
                if (res[index + j] && res[index + j].adjClose > max) {
                    max = res[index + j].adjClose
                }
            }
            i.diffInMonth = Number(((max - i.adjClose) / i.adjClose * 100).toFixed(2))
            const t3Price = res[index - 3]
            if (t3Price) {
                i.t3PriceClose = t3Price.adjClose
                i.t3Change = Number(((t3Price.adjClose - i.adjClose) / i.adjClose * 100).toFixed(2))
            }

            // Condition 2
            let arrVolume = []
            for (let j = 0; j < 15; j++) {
                if (res[index + j]) {
                    arrVolume.push(res[index + j].totalDealVolume)
                }
            }
            i.volume15dayChange = Number(((i.totalDealVolume - mean(arrVolume)) / mean(arrVolume) * 100).toFixed(2))
            i.arrVolume = arrVolume

            // Condition 3
            let arr20day = []
            for (let j = 0; j < 20; j++) {
                if (res[index - j]) {
                    arr20day.push(res[index - j])
                }
            }

            i.highestPriceClose = maxBy(arr20day, "adjClose").adjClose
            i.highestPriceCloseDate = maxBy(arr20day, "adjClose").tradingTime
            i.highestChangePrice20day = Number(((i.highestPriceClose - i.adjClose) / i.adjClose * 100).toFixed(2))

            i.lowestPriceCloseDate = minBy(arr20day, "adjClose").tradingTime
            i.lowestPriceClose = minBy(arr20day, "adjClose").adjClose
            i.lowestChangePrice20day = Number(((i.lowestPriceClose - i.adjClose) / i.adjClose * 100).toFixed(2))

            // Condition 4
            if (res[index + 1]) {
                const previousDayChange = res[index + 1].changePercent
                i.previousDayChange = Number((previousDayChange * 100).toFixed(2))
            }
            i.tradingTime = moment(i.tradingTime).format("YYYY-MM-DD")

            return i
        }).filter((i: any, index: number) => {
            return i.priceChange
                && i.priceChange > 4
                && i.volume15dayChange > 50
                && i.previousDayChange < 4
                && i.open !== i.high
                && i.diffInMonth < 10
            // && i.t3Change > -3
        })
        const average = {
            date: "averageDate",
            highestChangePrice20day: Number(meanBy(xxx, 'highestChangePrice20day').toFixed(2))
        }
        xxx.push(average)
        const analysedData = analyseData(xxx, res, startDate, endDate)
        setData(analysedData)
        return { data: analysedData, symbol }
    }

    const getHistoricalQuotes = (symbol: string, startDate: string, endDate: string) => {
        if (!startDate || !endDate) return

        return axios({
            url: "https://fwtapi1.fialda.com/api/services/app/StockInfo/GetHistoricalData",
            method: "GET",
            params: {
                symbol: symbol.toUpperCase(),
                fromDate: `${startDate}T00:00:00.094`,
                toDate: `${endDate}T15:09:14.095`,
                pageNumber: 1,
                pageSize: 1000
            }
        }).then(res => {
            // console.log(res)
            return res.data.result.items
        }).catch(e => {
            // console.log(e)
        })

    }

    const testList = () => {
        setShowAll(true)
        const listPromises: any = []
        listSymbol.map((i: any) => {
            listPromises.push(getData(i))
        })
        Promise.all(listPromises).then((res: any) => {
            console.log(res)
            const maxLength: any = maxBy(res, "data.length")
            // console.log(maxLength)
            const result = [];
            for (let i = 0; i < maxLength.data.length; i++) {
                let item: any = {};
                res.map((j: any) => {
                    // console.log(j)
                    item.count = i
                    item[j.symbol] = (j.data[i] || {}).totalNAV
                })
                result.push(item)
            }
            // console.log(249, result)
            setListData(result)
        }).catch(e => {
            console.log(e)
        })
    }

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
            const listDropdown = (res.data.filter((i: any) => i.name === "thanh_khoan_vua")[0] || {}).symbols || []

            setListSymbol(listDropdown)
        }
    }

    useEffect(() => {
        getWatchlist();
        getData(symbol);
    }, [])

    const columns = [
        {
            title: 'Date',
            render: (data: any) => {
                return data.tradingTime
            }
        },
        {
            title: 'sellDate',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.sellDate
            }
        },
        {
            title: 'changeSellDate',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.changeSellDate.toFixed(2)
            }
        },
        {
            title: 'totalNAV',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.totalNAV
            }
        },
    ]

    const dateFormat = 'YYYY-MM-DD';
    const listDropdown = (listWatchlists.filter((i: any) => i.name === "thanh_khoan_vua")[0] || {}).symbols || []
    // ['HPG', 'NKG', 'TLH', "HSG"]
    // console.log(listDropdown, listWatchlists, listWatchlists.filter((i: any) => i.name === "thanh_khoan_vua"))
    const children = [];
    for (let i = 0; i < listDropdown.length; i++) {
        children.push(<Option value={listDropdown[i]} key={i}>{listDropdown[i]}</Option>);
    }

    return <div>
        <div>
            <ReactMarkdown>
                {`
                    \n - dau tu 1 ma theo chien thuat nay       
                    \n - List ma: ${symbol}
                    \n - Thoi gian: ${startDate} -> ${endDate}
                    \n - So tien ban dau: 100
                    \n - So tien them hang thang: 30
                    
                `}
            </ReactMarkdown>
        </div>

        <Input onPressEnter={() => getData(symbol)} style={{ width: "200px" }} value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select"
            value={listSymbol}
            onChange={(e) => setListSymbol(e)}
        >
            {children}
        </Select>
        <RangePicker
            onChange={(e: any) => {
                setStartDate(moment(e[0]).format(dateFormat))
                setEndDate(moment(e[1]).format(dateFormat))
            }}
            defaultValue={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
            format={dateFormat}
        />
        <br />
        <Button onClick={() => {
            setShowAll(false)
            getData(symbol)
        }}>Test</Button>
        <Button onClick={testList}>Test List</Button>
        {showAll
            ? <div>
                <GraphsTab data={listData} listDataKey={listSymbol} />
            </div>
            : <div>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: 800 }} />
            </div>
        }
    </div>
}

function GraphsTab({ data, listDataKey }: any) {
    const listColor = ['red', 'blue', 'green', 'orange', 'black']
    return <div>
        <LineChart
            width={1000}
            height={500}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="count" />
            <YAxis domain={[100, 130]} />
            <Tooltip />
            <Legend />
            {
                listDataKey.map((i: any, index: number) => {
                    return <Line type="monotone" dataKey={i} stroke={listColor[index]} />
                })
            }
        </LineChart>
    </div >
}

function ScoreboardTab({ cb, data }: any) {
    const [symbol, setSymbol] = useState('NKG');

    const columns = [
        {
            title: 'Date',
            render: (data: any) => {
                return moment(data.tradingTime).format('YYYY-MM-DD')
            }
        },
        {
            title: 'priceChange',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.priceChange
            }
        },
        // {
        //     title: 'previousDayChange',
        //     align: 'right' as 'right',
        //     render: (data: any) => {
        //         return data.previousDayChange
        //     }
        // },
        // {
        //     title: 'diffInMonth',
        //     align: 'right' as 'right',
        //     render: (data: any) => {
        //         return <div style={{
        //             background: data.diffInMonth > 10 ? "red" : "white",
        //             color: data.diffInMonth > 10 ? "white" : "black"
        //         }}>{data.diffInMonth}</div>
        //     }
        // },
        {
            title: 'volume15dayChange',
            align: 'right' as 'right',
            render: (data: any) => {
                return <div style={{
                    // background: data.volume15dayChange < 50 ? "red" : "white",
                    color: data.volume15dayChange < 50 ? "red" : "black"
                }}>{data.volume15dayChange}
                    {/* | {data.arrVolume.join(", ")} */}
                </div>
            }
        },
        {
            title: 't3Change',
            align: 'right' as 'right',
            render: (data: any) => {
                return <div style={{
                    // background: data.t3Change < -3 ? "red" : "white",
                    color: data.t3Change < -3 ? "red" : "black"
                }}>{data.t3Change}</div>
            }
        },
        {
            title: 'highestChangePrice20day',
            sorter: (a: any, b: any) => {
                return a.highestChangePrice20day - b.highestChangePrice20day
            },
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
                    // background: data.lowestChangePrice20day < -5 ? "red" : "white",
                    color: data.lowestChangePrice20day < -5 ? "red" : "black"
                }}>{data.lowestChangePrice20day} | {moment(data.lowestPriceCloseDate).format("MM-DD")}</div>
            }
        }
    ]

    const handleChangeInput = (e: any) => {
        setSymbol(e.target.value)
    }

    const handlePressEnter = () => {
        cb()
    }


    useEffect(() => {
        cb(symbol)
    }, [])

    return <>
        <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
                <ReactMarkdown>
                    {`
                        \n - Test break
                        \n - Symbol: NKG
                        \n - Time: 1/1/2020 - 31/12/2020
                        \n - Condition test: 
                        \n   - priceChange > 4%
                        \n   - diffInMonth > 10%
                        \n   - t3Change > -3%
                        \n   - volume15dayChange > 50%
                        \n   - previousDayChange < 4%
                        \n   - open !== high
                    `}
                </ReactMarkdown>
            </div>
            <div style={{ width: "50%" }}>
                <ReactMarkdown>
                    {`
                        \n - Note:
                        \n   - HDG: 06-01
                        \n   - NKG: 01-25
                        \n   - SCR: 02-18, 03-04, 04-27
                        \n   - DBC: 12-18, 12-29, 11-20, 09-11, 07-16, 03-30, 
                    `}
                </ReactMarkdown>
            </div>
        </div>
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
    </>
}

function TestTab() {
    return <div>
        TestTab
    </div>
}

const findSellDate = (buyDate: string, listData: any) => {
    // console.log(buyDate, 'findSellDate', 514)
    let result: string
    const filteredListData = sortBy(listData, "tradingTime")
    let buyItem: any;
    let changePercent: number;
    let sellIndex = -1;
    let next = true;
    filteredListData.forEach((i: any, index: number) => {
        if (index === sellIndex) {
            result = i
            next = false
        }
        if (next) {
            if (i.tradingTime === buyDate) {
                buyItem = i
                sellIndex = index + 19
            }

            if (buyItem && buyItem.adjClose) {
                changePercent = (i.adjClose - buyItem.adjClose) / buyItem.adjClose * 100
            }

            if (changePercent > 5) {
                result = i
                next = false
            }

            if (changePercent < -3) {
                result = i
                next = false
            }
        }
    })
    return result
}

const analyseData = (data: any, fullData: any, startDate: string, endDate: string) => {
    const sortedData = sortBy(data, "tradingTime")
    // console.log(sortedData)
    const dataObj = keyBy(sortedData, "tradingTime")
    const result = [];
    var end = new Date(2021, 8, 31);
    let buyDate: any;
    let sellDateObj: any;
    // console.log(sortedData)

    let totalNAV = 100;
    let monthlyAdd = 30;
    for (let d = moment(startDate); d.isBefore(moment(endDate)); d.add(1, "days")) {
        const date = moment(d).format('YYYY-MM-DD')
        if (sellDateObj && date < sellDateObj.tradingTime) continue
        buyDate = dataObj[date] && dataObj[date].tradingTime

        if (buyDate) {
            sellDateObj = findSellDate(buyDate, fullData)
            // console.log(sellDateObj)
            if (sellDateObj) {
                dataObj[date].sellDate = sellDateObj.tradingTime
                dataObj[date].changeSellDate = (sellDateObj.adjClose - dataObj[date].adjClose) / dataObj[date].adjClose * 100
                totalNAV = totalNAV * (dataObj[date].changeSellDate / 100 + 1) + monthlyAdd
                dataObj[date].totalNAV = Number(totalNAV.toFixed(0))

                result.push(dataObj[date])
            }

        }
    }
    // console.log(result)
    return result
}
