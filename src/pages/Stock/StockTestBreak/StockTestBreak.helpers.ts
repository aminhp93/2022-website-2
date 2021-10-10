import moment from "moment";
import { keyBy, sortBy, isEmpty, orderBy } from "lodash";

export const singleColumns = [
    {
        title: 'Buy Date',
        render: (data: any) => {
            return data.tradingTime
        }
    },
    {
        title: 'Sell Date',
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
    {
        title: 'baseNAV',
        align: 'right' as 'right',
        render: (data: any) => {
            return data.baseNAV
        }
    },
]

export const combinedColumns = [
    {
        title: "Symbol",
        render: (data: any) => {
            return data.symbol
        }
    },
    {
        title: 'Buy Date',
        render: (data: any) => {
            return data.buyDate
        }
    },
    {
        title: 'Sell Date',
        render: (data: any) => {
            return data.sellDate
        }
    },
    {
        title: 'Percent Change',
        render: (data: any) => {
            return data.percentChange
        }
    },
    {
        title: 'total NAV',
        render: (data: any) => {
            return data.totalNAV
        }
    },
]

export const testVariableColumns = [
    {
        title: "variableCombine",
        render: (data: any) => {
            return data.variableCombine
        }
    },
    {
        title: "totalNAV",
        render: (data: any) => {
            return data.totalNAV
        }
    },
]

export const findSellDate = (buyDate: string, listData: any, var1 = 10, var2 = -3, var3 = 10) => {
    let result: any;
    const filteredListData = sortBy(listData, "tradingTime")
    let buyItem: any;
    let changePercent: number;
    let sellIndex = -1;
    let next = true;
    let buyItemIndex: number;
    filteredListData.forEach((i: any, index: number) => {
        if (next && index === sellIndex) {
            result = i
            next = false
        }
        if (next) {
            if (i.tradingTime === buyDate) {
                buyItem = i
                sellIndex = index + var1
                buyItemIndex = index
            }

            if (index > buyItemIndex + 2) {
                if (buyItem && buyItem.adjClose) {
                    changePercent = (i.adjClose - buyItem.adjClose) / buyItem.adjClose * 100
                }

                if (changePercent > var3) {
                    result = i
                    next = false
                }

                if (changePercent < var2) {
                    result = i
                    next = false
                }

            }
        }
    })
    // console.log(result)
    return result
}

export const analyseData = (data: any, fullData: any, startDate: string, endDate: string) => {
    const sortedData = sortBy(data, "tradingTime")
    const dataObj = keyBy(sortedData, "tradingTime")
    const result = [];
    let buyDate: any;
    let sellDateObj: any;

    let totalNAV = 100;
    let baseNAV = 100;
    let monthlyAdd = 0;
    for (let d = moment(startDate); d.isBefore(moment(endDate)); d.add(1, "days")) {
        const date = moment(d).format('YYYY-MM-DD')
        if (sellDateObj && date < sellDateObj.tradingTime) continue
        buyDate = dataObj[date] && dataObj[date].tradingTime

        if (buyDate) {
            sellDateObj = findSellDate(buyDate, fullData)
            if (sellDateObj) {
                dataObj[date].sellDate = sellDateObj.tradingTime
                dataObj[date].changeSellDate = (sellDateObj.adjClose - dataObj[date].adjClose) / dataObj[date].adjClose * 100
                totalNAV = totalNAV * (dataObj[date].changeSellDate / 100 + 1) + monthlyAdd
                baseNAV = baseNAV + monthlyAdd
                dataObj[date].totalNAV = Number(totalNAV.toFixed(0))
                dataObj[date].baseNAV = baseNAV
                result.push(dataObj[date])
            }
        }
    }
    return result
}

export const findBuyDate = (date: string, listData: any) => {
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
        if (result[date].length > 1) {
            result[date] = orderBy(result[date], "volume15dayChange", "desc")
            // console.log(result[date])
        }
        // console.log(result[date])
        return result[date][0]
    }
    return null
}
