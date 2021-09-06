import { useEffect, useState } from 'react';
import { notification } from "antd";
import axios from "axios";
import { random, keyBy, meanBy } from "lodash";
import moment from "moment";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
    DATE_FORMAT,
} from "../../../helpers/utils";

const EXCLUDES_WATCHLIST = [
    {
        watchlistID: "75482",
        name: "watching"
    },
    {
        watchlistID: "277939",
        name: "vn30"
    },
    {
        watchlistID: "347001",
        name: "da_mua"
    },
    {
        watchlistID: "365074",
        name: "thanh_khoan_lon"
    },
    {
        watchlistID: "396060",
        name: "aim_to_buy"
    },
    {
        watchlistID: "737544",
        name: "thanh_khoan_vua"
    }
]

export default function IndustryAndMarket() {

    const [listWatchlists, setListWatchlists] = useState([])

    const getWatchlist = async () => {
        const res = await axios({
            method: "GET",
            url: "https://restv2.fireant.vn/me/watchlists",
            headers: {
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNjIzMDMyLCJuYmYiOjE2MTM2MjMwMzIsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM2MjMwMzIsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiZmIyZWJkNzAzNTBiMDBjMGJhMWE5ZDA5NGUwNDMxMjYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.OhgGCRCsL8HVXSueC31wVLUhwWWPkOu-yKTZkt3jhdrK3MMA1yJroj0Y73odY9XSLZ3dA4hUTierF0LxcHgQ-pf3UXR5KYU8E7ieThAXnIPibWR8ESFtB0X3l8XYyWSYZNoqoUiV9NGgvG2yg0tQ7lvjM8UYbiI-3vUfWFsMX7XU3TQnhxW8jYS_bEXEz7Fvd_wQbjmnUhQZuIVJmyO0tFd7TGaVipqDbRdry3iJRDKETIAMNIQx9miHLHGvEqVD5BsadOP4l8M8zgVX_SEZJuYq6zWOtVhlq3uink7VvnbZ7tFahZ4Ty4z8ev5QbUU846OZPQyMlEnu_TpQNpI1hg"
            }
        })
        if (res && res.data) {

            let filter = res.data.filter((i: any) => !(EXCLUDES_WATCHLIST.map((j: any) => Number(j.watchlistID)).includes(i.watchlistID)))
            let listSymbols: any = []
            filter.forEach((i: any) => listSymbols = listSymbols.concat(i.symbols))

            const listPromises: any = []
            const startDate = moment().add(-1000, 'days').format(DATE_FORMAT)
            const endDate = moment().add(0, 'days').format(DATE_FORMAT)
            listSymbols.map((i: any) => {
                listPromises.push(getHistoricalQuotes(i, startDate, endDate))
            })
            Promise.all(listPromises).then(res2 => {
                // console.log(res2);
                const res2Obj: any = keyBy(res2, "symbol")
                notification.success({ message: "success" })


                filter.map((i: any) => {
                    i.percentChangeSymbols = i.symbols
                        .map((j: any) => {
                            const percentChange = (res2Obj[j].priceClose - res2Obj[j].priceOpen) / res2Obj[j].priceOpen * 100
                            return {
                                symbol: j,
                                percentChange
                            }
                        })
                        .filter((j: any) => Number(j.percentChange.toFixed(2)) > 1)
                    i.average = Number(meanBy(i.percentChangeSymbols, 'percentChange').toFixed(2))
                    return i
                })

                filter = filter.sort((a: any, b: any) => {
                    return a.average - b.average
                })

                // console.log(filter)
                setListWatchlists(filter)
            })


        }
    }

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
                limit: "20",
            }
        })
        if (res && res.data && res.data.length) return res.data[0]
        return null
    }

    useEffect(() => {
        getWatchlist()
    }, [])

    return <div>
        <ResponsiveContainer width='100%' aspect={4.0 / 3.0}>
            <BarChart data={listWatchlists} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" reversed type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" barSize={20} fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    </div>
}
