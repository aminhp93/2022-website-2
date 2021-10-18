import { useState, useEffect } from "react";
import { keyBy } from "lodash";

import StockService from '../../../services/stock'

export default function StockMarketOverview() {
    const [listWatchlists, setListWatchlists] = useState([])

    const fetch = async () => {
        const res = await StockService.getWatchlist()
        if (res && res.data) {
            setListWatchlists(res.data)
            const xxx = keyBy(res.data, "watchlistID")
            const xxx2 = xxx["476714"];
            const listPromises: any = [];
            ((xxx2 || {}).symbols || []).forEach((i: any) => {
                listPromises.push(StockService.getHistoricalQuotes(i, "2021-01-01", "2021-10-14"))
            })
            Promise.all(listPromises).then(res => {
                console.log(res)
            })
        }
    }

    const objWatchlists = keyBy(listWatchlists, "watchlistID")
    const _8633_dau_co_va_BDS = objWatchlists["476714"]

    useEffect(() => {
        fetch()
    }, [])

    return <div>
        StockMarketOverview
        <div>
            <div>Ck</div>
            {
                ((_8633_dau_co_va_BDS || {}).symbols || []).map((i: any) => {
                    return <div>{i}</div>
                })
            }
        </div>
    </div>
}
