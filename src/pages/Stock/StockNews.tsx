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
            // fetch(res.data, "watching").then(res => setData3(res))
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
        fetch();
    }, [])

    return <div style={{ height: "500px", overflow: "auto" }}>
        {
            viewDetail
                ? <div>
                    <Button onClick={handleBack}>Back</Button>
                    <div>{newsDetail && parse(newsDetail)}</div>
                </div>
                : <List

                    bordered
                    dataSource={list}
                    renderItem={item => (
                        <List.Item onClick={() => handleClickNews(item.postID)}>
                            {moment(item.date).format("MM-DD")} - {item.symbol} - {item.title}
                        </List.Item>
                    )}
                />
        }

    </div>
}
