import { useState, useEffect, useCallback } from "react";
import { keyBy, meanBy } from "lodash";
import { notification } from "antd";
import axios from "axios";
import { CloseOutlined } from '@ant-design/icons'

import StockService from '../../../services/stock'

export default function StockMarketOverview() {
    const [listWatchlists, setListWatchlists] = useState([])
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [editable, setEditable] = useState(false);

    const fetch = async (listWatchlists: any, watchlistID: string) => {
        const xxx = keyBy(listWatchlists, "watchlistID")
        const xxx2 = xxx[watchlistID];
        const listPromises: any = [];
        ((xxx2 || {}).symbols || []).forEach((i: any) => {
            listPromises.push(StockService.getHistoricalQuotes(i, "2021-01-01", "2021-11-02", 'fireant'))
        })
        return Promise.all(listPromises).then(res => {
            let mappedData = res
                .map((i: any) => {
                    const listItem = i.data
                    const changePercent = (listItem[0].priceClose - listItem[1].priceClose) / listItem[1].priceClose * 100
                    const todayItem = listItem[0]
                    // listItem.splice(0, 1)
                    const averageVolume15Days = meanBy(listItem, 'dealVolume')

                    const estimatedVolumeChange = (todayItem.dealVolume / averageVolume15Days) * 100
                    return {
                        symbol: todayItem.symbol,
                        changePercent: Number(changePercent.toFixed(1)),
                        estimatedVolumeChange: Number(estimatedVolumeChange.toFixed(0)),
                        todayVolume: (todayItem.dealVolume / 1000000).toFixed(2),
                        averageVolume15Days: (averageVolume15Days / 1000000).toFixed(2)
                    }
                })
                .sort((a: any, b: any) => {
                    return b.changePercent - a.changePercent
                })
            return mappedData
        })
    }

    const fetchList = async () => {
        const res = await StockService.getWatchlist()
        if (res && res.data) {
            setListWatchlists(res.data)
            fetch(res.data, "476714").then(res => setData1(res))
            fetch(res.data, "476720").then(res => setData2(res))
            fetch(res.data, "75482").then(res => setData3(res))
            fetch(res.data, "1140364").then(res => setData4(res))
        }
    }

    const handleReset = async () => {
        const listThanhKhoanVua = keyBy(listWatchlists, "watchlistID")['737544']
        const res = await axios({
            method: "PUT",
            url: `https://restv2.fireant.vn/me/watchlists/1140364`,
            headers: {
                "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNzE1ODY4LCJuYmYiOjE2MTM3MTU4NjgsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM3MTU4NjcsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzZmNmNkZWE2MTcxY2Q5NGRiNWZmOWZkNDIzOWM0OTYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.oZ8S_sTP6qVRJqY4h7g0JvXVPB0k8tm4go9pUFD0sS_sDZbC6zjelAVVNGHWJja82ewJbUEmTJrnDWAKR-rg5Pprp4DW7MzaN0lw3Bw0wEacphtyglx-H14-0Wnv_-2KMyQLP5EYH8wgyiw9I3ig_i7kHJy-XgCd__tdoMKvarkIXPzJJJY32gq-LScWb3HyZsfEdi-DEZUUzjAHR1nguY8oNmCiA6FaQCzOBU_qfgmOLWhN9ZNN1G3ODAeoOnphLJuWjHIrwPuVXy6B39eU2PtHmujtw_YOXdIWEi0lRhqV1pZOrJEarQqjdV3K5XNwpGvONT8lvUwUYGoOwwBFJg"
            },
            data: {
                name: 'aim_to_buy',
                symbols: listThanhKhoanVua.symbols,
                userName: "minhpn.org.ec1@gmail.com",
                watchlistID: 1140364,
            }
        })
        if (res && res.data) {
            fetchList()
            notification.success({ message: "Success" })
        }
    }

    const handleRemove = async (symbol: string) => {
        const removedData = data4.filter((i: any) => i.symbol !== symbol)
        setData4(removedData)
        const res = await axios({
            method: "PUT",
            url: `https://restv2.fireant.vn/me/watchlists/1140364`,
            headers: {
                "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNzE1ODY4LCJuYmYiOjE2MTM3MTU4NjgsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM3MTU4NjcsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzZmNmNkZWE2MTcxY2Q5NGRiNWZmOWZkNDIzOWM0OTYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.oZ8S_sTP6qVRJqY4h7g0JvXVPB0k8tm4go9pUFD0sS_sDZbC6zjelAVVNGHWJja82ewJbUEmTJrnDWAKR-rg5Pprp4DW7MzaN0lw3Bw0wEacphtyglx-H14-0Wnv_-2KMyQLP5EYH8wgyiw9I3ig_i7kHJy-XgCd__tdoMKvarkIXPzJJJY32gq-LScWb3HyZsfEdi-DEZUUzjAHR1nguY8oNmCiA6FaQCzOBU_qfgmOLWhN9ZNN1G3ODAeoOnphLJuWjHIrwPuVXy6B39eU2PtHmujtw_YOXdIWEi0lRhqV1pZOrJEarQqjdV3K5XNwpGvONT8lvUwUYGoOwwBFJg"
            },
            data: {
                name: 'aim_to_buy',
                symbols: removedData.map((i: any) => i.symbol),
                userName: "minhpn.org.ec1@gmail.com",
                watchlistID: 1140364,
            }
        })
        if (res && res.data) {
            fetchList()
            notification.success({ message: "Success" })
        }

    }

    useEffect(() => {
        fetchList()
        // setInterval(() => {
        // fetchList()
        // }, 60000)
    }, [])

    return <div>
        StockMarketOverview
        <div style={{ display: "flex" }}>
            <div>
                <div>bds</div>
                {
                    data1.map((i: any) => {
                        return <div style={{ display: "flex", justifyContent: "space-between", width: "100px" }}>
                            <div>{i.symbol} </div>
                            <div>{i.changePercent}</div>
                        </div>
                    })
                }
            </div>
            <div style={{ margin: "0 20px" }}>
                <div>Ck</div>
                {
                    data2.map((i: any) => {
                        return <div style={{ display: "flex", justifyContent: "space-between", width: "100px" }}>
                            <div>{i.symbol} </div>
                            <div>{i.changePercent}</div>
                        </div>
                    })
                }
            </div>
            <div>
                <div>watching</div>
                {
                    data3.map((i: any) => {
                        return <div style={{ display: "flex", justifyContent: "space-between", width: "100px" }}>
                            <div>{i.symbol} </div>
                            <div>{i.changePercent}</div>
                        </div>
                    })
                }
            </div>
            <div style={{ margin: "0 20px" }}>
                <div>aim to buy</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ width: "300px" }}>
                        {
                            data4.map((i: any) => {
                                return <div style={{ display: "flex" }}>
                                    <div style={{ width: "50px" }}>{i.symbol} {editable && <CloseOutlined onClick={() => handleRemove(i.symbol)} />} </div>
                                    <div style={{ width: "50px" }}>{i.changePercent}</div>
                                    <div style={{ width: "50px" }}>{i.estimatedVolumeChange}</div>
                                    {/* <div>{i.todayVolume}</div> */}
                                    {/* <div>{i.averageVolume15Days}</div> */}
                                </div>
                            })
                        }
                    </div>
                    <div>
                        <div onClick={handleReset}>Reset</div>
                        <div onClick={() => setEditable(!editable)}>Edit</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
}
