import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Input, Table, Button, DatePicker, Select, Dropdown, Menu, notification, Spin } from "antd";
import { mean, maxBy, minBy, meanBy, keyBy, orderBy, range, chunk, cloneDeep, get } from "lodash";
import StockTestBreak_GraphsTab from "./StockTestBreak_GraphsTab"
import { analyseData, findSellDate, singleColumns, combinedColumns, findBuyDate, testVariableColumns } from "./StockTestBreak.helpers"
import StockService from '../../../services/stock'
import React from "react";
import MDEditor from '@uiw/react-md-editor';

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
    const [testVariableData, setTestVariableData] = useState([]);
    const [volume15dayChange, setVolume15dayChange] = useState(50);

    const getData = async (symbol: string, combined?: boolean, testVariable?: boolean) => {
        const res2 = await StockService.getHistoricalQuotes(symbol, startDate, endDate)
        const res = get(res2, 'data.result.items')
        if (!res) {
            return { "failedSymbol": symbol }
        }
        let xxx = res
            .map((i: any, index: number) => {
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
            })

        if (testVariable) {
            return {
                symbol,
                data: xxx
            }
        } else {
            xxx = xxx.filter((i: any, index: number) => {
                return i.priceChange
                    && i.priceChange > 4
                    && i.volume15dayChange > volume15dayChange
                    && i.previousDayChange < 4
                    && i.open !== i.high
                    && i.diffInMonth < 10
            })
        }

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

        const totalNAV = (maxBy(analysedData, 'totalNAV') || {}).totalNAV
        setData(analysedData)

        return { data: analysedData, symbol, totalNAV }
    }

    const testList = async () => {
        setTestType("multiple")
        setLoading(true)

        const chunkedListSymbol = chunk(listSymbol, 30)
        console.log(chunkedListSymbol)
        let res: any = [];
        for (let i = 0; i < chunkedListSymbol.length; i++) {
            const listPromises: any = []
            for (let j = 0; j < chunkedListSymbol[i].length; j++) {
                listPromises.push(getData(chunkedListSymbol[i][j]))
            }
            const partialRes = await Promise.all(listPromises)
            res = res.concat(partialRes)
        }
        setLoading(false)
        const failedSymbolList = res.filter((i: any) => i.failedSymbol)

        if (failedSymbolList && failedSymbolList.length > 0) {
            notification.error({ message: failedSymbolList.map((i: any) => i.failedSymbol).join(", ") })
            return
        }

        let sortedRes = orderBy(res, 'totalNAV', "desc")
        sortedRes = sortedRes.splice(0, 20)
        const maxLength: any = maxBy(sortedRes, "data.length")
        let result = [];
        for (let i = 0; i < maxLength.data.length; i++) {
            let item: any = {};
            sortedRes.map((j: any) => {
                item.count = i
                item[j.symbol] = (j.data[i] || {}).totalNAV
            })
            result.push(item)
        }
        setListSymbol(sortedRes.map((i: any) => i.symbol))
        setListData(result)
        console.log(result)
        update(sortedRes.map((i: any) => i.symbol))
    }

    const testVariable = async () => {
        setLoading(true)
        setTestType("testVariable")

        const chunkedListSymbol = chunk(listSymbol, 30)
        console.log(chunkedListSymbol)
        let res: any = [];
        for (let i = 0; i < chunkedListSymbol.length; i++) {
            const listPromises: any = []
            for (let j = 0; j < chunkedListSymbol[i].length; j++) {
                listPromises.push(getData(chunkedListSymbol[i][j], true, true))
            }
            const partialRes = await Promise.all(listPromises)
            res = res.concat(partialRes)
        }
        setLoading(false)
        const failedSymbolList = res.filter((i: any) => i.failedSymbol)

        if (failedSymbolList && failedSymbolList.length > 0) {
            notification.error({ message: failedSymbolList.map((i: any) => i.failedSymbol).join(", ") })
            return
        }

        let rootResult: any = [];
        let tempRes: any;
        range(50, 100).map((var4: any) => {
            tempRes = cloneDeep(res).map((item: any) => {
                item.fullData = item.data

                item.data = item.data.filter((i: any, index: number) => {
                    return i.priceChange
                        && i.priceChange > 4
                        && i.volume15dayChange > var4
                        && i.previousDayChange < 4
                        && i.open !== i.high
                        && i.diffInMonth < 10
                })
                return item
            })

            const objRes = keyBy(tempRes, "symbol")
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
                    buyDateObj = findBuyDate(date, tempRes)
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
                            totalNAV,
                            volume15dayChange: buyDateObj.volume15dayChange
                        })
                        buyDate = null
                    }
                }
            }
            rootResult.push({
                variableCombine: `${var4}`,
                totalNAV: maxBy(result, "totalNAV").totalNAV,
                result
            })
        })

        rootResult = orderBy(rootResult, "totalNAV", "desc")
        console.log(rootResult)
        setTestVariableData(rootResult)
    }

    const clickTestCombine = async () => {
        setTestType("combined")
        setLoading(true)

        const chunkedListSymbol = chunk(listSymbol, 30)
        console.log(chunkedListSymbol)
        let res: any = [];
        for (let i = 0; i < chunkedListSymbol.length; i++) {
            const listPromises: any = []
            for (let j = 0; j < chunkedListSymbol[i].length; j++) {
                listPromises.push(getData(chunkedListSymbol[i][j], true))
            }
            const partialRes = await Promise.all(listPromises)
            res = res.concat(partialRes)
        }
        setLoading(false)
        const failedSymbolList = res.filter((i: any) => i.failedSymbol)

        if (failedSymbolList && failedSymbolList.length > 0) {
            notification.error({ message: failedSymbolList.map((i: any) => i.failedSymbol).join(", ") })
            return
        }

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
        // console.log(result)
        result && setCombinedData(result)
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
        const res: any = await StockService.getWatchlist()
        if (res && res.data) {
            setListWatchlists(res.data)
        }
    }

    useEffect(() => {
        getWatchlist();
    }, [])

    const dateFormat = 'YYYY-MM-DD';
    const listDropdown = (listWatchlists.filter((i: any) => i.name === "thanh_khoan_vua")[0] || {}).symbols || []
    const children: any = [];
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

    const leftHeader = () => {
        return <div style={{ width: "50%", height: "100%", overflow: "auto" }}>
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
            <Button disabled={loading} onClick={clickTestCombine}>Test Combine Auto Find Symbol</Button>
            <hr />
            <Input onPressEnter={testVariable} style={{ width: "200px" }} value={volume15dayChange} onChange={(e) => setVolume15dayChange(Number(e.target.value))} />
            <Button disabled={loading} onClick={testVariable}>Test variable</Button>
            <div>
                <div>Number days till sell: 19</div>
                <div>Profit percent to sell: 10%</div>
                <div>Stop loss percent to sell: -3%</div>
                <div>{`Find buy date: if > 1 results found, order by volume15dayChange`}</div>
            </div>
        </div>
    }

    const rightHeader = () => {
        return <div style={{ width: "50%", height: "100%", overflow: "auto" }}>
            <MDEditor.Markdown source={`
                    \n - dau tu 1 ma theo chien thuat nay       
                    \n - So tien ban dau: 100
                    \n - So tien them hang thang: 30
                    \n - findSellDate
                    \n   - within 19 trading days
                    \n   - sell all if < -3
                    \n   - sell all if > 10
                `} />


        </div>
    }

    const content = () => {
        return <div>
            {!testType && "No content"}
            {testType === "single" && <div>
                <Table
                    dataSource={data}
                    columns={singleColumns}
                    pagination={false}
                    scroll={{ y: 800 }} />
            </div>}

            {testType === "multiple" && (
                loading
                    ? <Spin />
                    : <div>
                        <StockTestBreak_GraphsTab data={listData} listDataKey={listSymbol} />
                    </div>
            )}

            {testType === "combined" && (
                loading
                    ? <Spin />
                    : <div>
                        <Table
                            dataSource={combinedData}
                            columns={combinedColumns}
                            pagination={false}
                            scroll={{ y: 800 }} />
                    </div>
            )}

            {testType === "testVariable" && (

                loading
                    ? <Spin />
                    : <div>
                        <div style={{ display: "flex" }}>
                            <div>{`<100: ${testVariableData.filter((i: any) => i.totalNAV < 100).length}`}</div>
                            <div>{`>100: ${testVariableData.filter((i: any) => i.totalNAV > 100 && i.totalNAV < 200).length}`}</div>
                            <div>{`>200: ${testVariableData.filter((i: any) => i.totalNAV > 200 && i.totalNAV < 300).length}`}</div>
                            <div>{`>300: ${testVariableData.filter((i: any) => i.totalNAV > 300 && i.totalNAV < 400).length}`}</div>
                            <div>{`>400: ${testVariableData.filter((i: any) => i.totalNAV > 400).length}`}</div>
                        </div>
                        <Table
                            dataSource={testVariableData}
                            columns={testVariableColumns}
                            pagination={false}
                            scroll={{ y: 800 }} />
                    </div>

            )}
        </div>
    }

    return <div>
        <div style={{ display: "flex", height: "400px" }}>
            {leftHeader()}
            {rightHeader()}
        </div>
        {content()}
    </div>
}

