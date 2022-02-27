import React, { useEffect, useState } from "react";
import { keyBy, flatten } from "lodash";
import moment from "moment";
import { List, Button } from 'antd';
import parse from 'html-react-parser';

import StockService from '../../services/stock'

export default function StockNews() {
    const [list, setList] = useState([]);
    const [viewDetail, setViewDetail] = useState(false);
    const [newsDetail, setNewsDetail] = useState(null);

    const fetch = async () => {
        const res = await StockService.getWatchlist()
        if (res && res.data) {
            const listWatchlist = keyBy(res.data, "name")

            const listWatching = listWatchlist['watching']
            const listPromises: any = [];
            ((listWatching || {}).symbols || []).forEach((i: any) => {
                listPromises.push(StockService.getStockNews(i))
            })
            return Promise.all(listPromises).then((res2: any) => {
                let mappedData = res2
                    .map((i: any) => {
                        return i.data.map((j: any) => {
                            j.symbol = i.config.data
                            return j
                        })
                    })

                mappedData = flatten(mappedData)
                mappedData = mappedData.sort((a: any, b: any) => {
                    return new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1
                })
                setList(mappedData)
            })
        }
    }

    const fetchNewsDetail = async (id: number) => {
        const res = await StockService.getStockNewsDetail(id);
        if (res && res.data) {
            setNewsDetail(res.data.content)
        }
    }

    const handleClickNews = (id: number) => {
        setViewDetail(true)
        fetchNewsDetail(id)

    }

    const handleBack = () => {
        setViewDetail(false)
        setNewsDetail(null)
    }

    useEffect(() => {
        setInterval(() => {
            fetch();
        }, 1000 * 60)
        fetch();

    }, [])

    return <div className="StockNews">
        {
            viewDetail
                ? <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
                    <div style={{ height: "50px" }}>
                        <Button onClick={handleBack}>Back</Button>
                    </div>

                    <div style={{ flex: 1, overflow: "auto" }}>{newsDetail && parse(newsDetail)}</div>
                </div>
                : <List
                    style={{ overflow: "auto", height: "100%" }}
                    bordered
                    dataSource={list}
                    renderItem={item => (
                        <List.Item
                            onClick={() => handleClickNews(item.postID)}
                            className={`StockNews-item flex ${moment(item.date).format("MM-DD") === moment().format("MM-DD") ? "highlight" : ""}`}>
                            <div style={{ width: "60px" }}>
                                {moment(item.date).format("MM-DD")}
                            </div>
                            <div style={{ flex: 1 }}>
                                {item.symbol} - {item.title}
                            </div>

                        </List.Item>
                    )}
                />
        }

    </div>
}
