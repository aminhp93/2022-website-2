import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import moment from "moment";
import { Input, Table } from "antd";


export default function StockTestBreak_ScoreboardTab({ cb, data }: any) {
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

