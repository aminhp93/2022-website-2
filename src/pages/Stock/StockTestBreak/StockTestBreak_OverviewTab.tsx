import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Input, Table, Button, DatePicker, Select, Dropdown, Menu, notification, Spin } from "antd";
import { mean, maxBy, minBy, meanBy, keyBy, sortBy, isEmpty } from "lodash";
import StockTestBreak_GraphsTab from "./StockTestBreak_GraphsTab"
import { analyseData, findSellDate, singleColumns, combinedColumns } from "./StockTestBreak.helpers"

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function StockTestBreak_OverviewTab() {
    const [loading, setLoading] = useState(false);
    const [symbol, setSymbol] = useState("NKG");
    const [listSymbol, setListSymbol] = useState(['HPG', 'NKG', 'TLH', "HSG"]);
    const [startDate, setStartDate] = useState("2020-01-01");
    const [endDate, setEndDate] = useState("2020-12-31")
    const [data, setData] = useState([]);
    const [listData, setListData] = useState([]);
    const [listWatchlists, setListWatchlists] = useState([]);
    const [selectedWatchlist, setSelectedWatchlist] = useState(null)
    const [testType, setTestType] = useState(null);
    const [combinedData, setCombinedData] = useState([]);

    const getData = async (symbol: string, combined?: boolean) => {
        const res = await getHistoricalQuotes(symbol, startDate, endDate)
        if (!res) {
            // console.log(symbol)
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
        if (combined) {
            return {
                data: xxx,
                symbol,
                fullData: res
            }
        }
        const analysedData = analyseData(xxx, res, startDate, endDate)
        setData(analysedData)
        const totalNAV = (maxBy(analysedData, 'totalNAV') || {}).totalNAV
        return { data: analysedData, symbol, totalNAV }
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
        setTestType("multiple")
        setLoading(true)
        const listPromises: any = []
        listSymbol.map((i: any) => {
            listPromises.push(getData(i))
        })
        Promise.all(listPromises).then((res: any) => {
            console.log(res)
            setLoading(false)
            let sortedRes = sortBy(res, 'totalNAV').reverse()
            sortedRes = sortedRes.filter((i: any) => i.totalNAV)
            sortedRes = sortedRes.splice(0, 20)
            console.log(sortedRes)
            const maxLength: any = maxBy(sortedRes, "data.length")
            // console.log(maxLength)
            let result = [];
            for (let i = 0; i < maxLength.data.length; i++) {
                let item: any = {};
                sortedRes.map((j: any) => {
                    // console.log(j)
                    item.count = i
                    item[j.symbol] = (j.data[i] || {}).totalNAV
                })
                result.push(item)
            }
            console.log(249, result)
            setListSymbol(sortedRes.map((i: any) => i.symbol))
            setListData(result)
            update(sortedRes.map((i: any) => i.symbol))

        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }

    const testCombineAutoFindSymbol = () => {
        setTestType("combined")
        setLoading(true)
        const listPromises: any = []
        listSymbol.map((i: any) => {
            listPromises.push(getData(i, true))
        })

        Promise.all(listPromises).then((res: any) => {
            setLoading(false)
            console.log(res)
            const objRes = keyBy(res, "symbol")
            const result: any[] | PromiseLike<any[]> = [];
            let buyDate: any;
            let sellDate: any;
            let buyDateObj: any;
            let sellDateObj: any;
            let percentChange: any;
            let totalNAV = 100;

            for (let d = moment(startDate); d.isBefore(moment(endDate)); d.add(1, "days")) {
                const date = moment(d).format('YYYY-MM-DD')

                if (!buyDate) {
                    buyDateObj = findBuyDate(date, res)
                    if (buyDateObj && buyDateObj.tradingTime && (!sellDate || buyDateObj.tradingTime > sellDate)) {
                        buyDate = buyDateObj.tradingTime
                    }
                }

                if (buyDate) {
                    sellDateObj = findSellDate(buyDate, objRes[buyDateObj.symbol].fullData)
                    sellDate = sellDateObj && sellDateObj.tradingTime
                    if (sellDate) {
                        percentChange = Number(((sellDateObj.adjClose - buyDateObj.adjClose) / buyDateObj.adjClose * 100).toFixed(2))
                        totalNAV = Number((totalNAV * (1 + (sellDateObj.adjClose - buyDateObj.adjClose) / buyDateObj.adjClose)).toFixed(0))
                        result.push({
                            buyDate,
                            symbol: buyDateObj.symbol,
                            sellDate,
                            percentChange,
                            totalNAV
                        })
                        buyDate = null
                    }
                }
            }
            console.log(result)
            setCombinedData(result)
            return result

        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }

    const findBuyDate = (date: string, listData: any) => {
        const result: any = {};
        listData.map((i: any) => {
            const filteredList = i.data && i.data.filter((j: any) => j.tradingTime === date)
            if (filteredList && filteredList.length === 1) {
                if (!result[date]) {
                    result[date] = []
                }
                filteredList[0].symbol = i.symbol
                result[date].push(filteredList[0])
            }
        })
        if (!isEmpty(result)) {
            return result[date][0]
        }

        return null
    }


    const update = async (list: any) => {
        const res = await axios({
            method: "PUT",
            url: `https://restv2.fireant.vn/me/watchlists/1006042`,
            headers: {
                "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNzE1ODY4LCJuYmYiOjE2MTM3MTU4NjgsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM3MTU4NjcsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzZmNmNkZWE2MTcxY2Q5NGRiNWZmOWZkNDIzOWM0OTYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.oZ8S_sTP6qVRJqY4h7g0JvXVPB0k8tm4go9pUFD0sS_sDZbC6zjelAVVNGHWJja82ewJbUEmTJrnDWAKR-rg5Pprp4DW7MzaN0lw3Bw0wEacphtyglx-H14-0Wnv_-2KMyQLP5EYH8wgyiw9I3ig_i7kHJy-XgCd__tdoMKvarkIXPzJJJY32gq-LScWb3HyZsfEdi-DEZUUzjAHR1nguY8oNmCiA6FaQCzOBU_qfgmOLWhN9ZNN1G3ODAeoOnphLJuWjHIrwPuVXy6B39eU2PtHmujtw_YOXdIWEi0lRhqV1pZOrJEarQqjdV3K5XNwpGvONT8lvUwUYGoOwwBFJg"
            },
            data: {
                name: "highest_ROI_test",
                symbols: list,
                userName: "minhpn.org.ec1@gmail.com",
                watchlistID: 1006042,
            }
        })
        if (res && res.data) {
            notification.success({ message: "Success" })

        }
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
        }
    }

    useEffect(() => {
        getWatchlist();
        getData(symbol);
    }, [])

    const dateFormat = 'YYYY-MM-DD';
    const listDropdown = (listWatchlists.filter((i: any) => i.name === "thanh_khoan_vua")[0] || {}).symbols || []
    const children = [];
    for (let i = 0; i < listDropdown.length; i++) {
        children.push(<Option value={listDropdown[i]} key={i}>{listDropdown[i]}</Option>);
    }

    const objWatchlists = keyBy(listWatchlists, "watchlistID")

    const menu = (
        <Menu onClick={(item: any) => {
            setSelectedWatchlist(objWatchlists[item.key])
            setListSymbol(objWatchlists[item.key].symbols)
        }}>
            {
                listWatchlists.map((i: any) => {
                    return <Menu.Item key={i.watchlistID}>
                        {i.name}
                    </Menu.Item>
                })
            }
        </Menu>
    );


    return <div>
        <div>
            <ReactMarkdown>
                {`
                    \n - dau tu 1 ma theo chien thuat nay       
                    \n - List ma: ${symbol}
                    \n - Thoi gian: ${startDate} -> ${endDate}
                    \n - So tien ban dau: 100
                    \n - So tien them hang thang: 30
                    \n - findSellDate
                    \n   - within 19 trading days
                    \n   - sell all if < -3
                    \n   - sell all if > 10
                `}
            </ReactMarkdown>
        </div>
        <hr />
        <RangePicker
            onChange={(e: any) => {
                setStartDate(moment(e[0]).format(dateFormat))
                setEndDate(moment(e[1]).format(dateFormat))
            }}
            defaultValue={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
            format={dateFormat}
        />
        <hr />
        <Input onPressEnter={() => getData(symbol)} style={{ width: "200px" }} value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <Button onClick={() => {
            setTestType("single")
            getData(symbol)
        }}>Test</Button>
        <hr />
        <Dropdown overlay={menu} placement="bottomLeft" arrow>
            <div>{(selectedWatchlist && selectedWatchlist.name) || "Select watchlist"}</div>
        </Dropdown>
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
        <Button disabled={loading} onClick={testList}>Test List</Button>
        <hr />
        <Button disabled={loading} onClick={testCombineAutoFindSymbol}>Test Combine Auto Find Symbol</Button>
        <div style={{ marginBottom: "50px" }}>

        </div>
        {testType === "single" && <div>
            <Table
                dataSource={data}
                columns={singleColumns}
                pagination={false}
                scroll={{ y: 800 }} />
        </div>}
        {
            testType === "mulitple" && (
                loading
                    ? <Spin />
                    : <div>
                        <StockTestBreak_GraphsTab data={listData} listDataKey={listSymbol} />
                    </div>
            )
        }
        {
            testType === "combined" && (
                loading
                    ? <Spin />
                    : <div>
                        <Table
                            dataSource={combinedData}
                            columns={combinedColumns}
                            pagination={false}
                            scroll={{ y: 800 }} />
                    </div>
            )
        }

    </div>
}

