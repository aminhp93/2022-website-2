import axios from 'axios'
import { useEffect, useState } from "react"
import { Table } from 'antd';
import InViewMonitor from 'react-inview-monitor';
import { getColumnsFromListData } from 'utils'

export default function Test() {

    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [next, setNext] = useState(false)
    const [page, setPage] = useState(1)

    const fetch = () => {
        axios({

            method: "GET",
            // url: 'https://graph.instagram.com/me/media?fields=id,caption&access_token=IGQVJXR1djNU91NTRzU1N2T1puU1JLZA2FZAUkxjR0RfQkVvd0pvNjhsMnNianlsaU1fTkJJNmRYaDZAQcFl4YUxsVUhLWWRDVVB1clBodlNfQzlNalQyU2tVVURhSDJ2SHBjQ25wcGxjeVFtc1QtX1loeG1xZAGtpTkxIWlkw'
            url: 'https://graph.instagram.com/me/media?fields=id,caption&access_token=IGQVJXR1djNU91NTRzU1N2T1puU1JLZA2FZAUkxjR0RfQkVvd0pvNjhsMnNianlsaU1fTkJJNmRYaDZAQcFl4YUxsVUhLWWRDVVB1clBodlNfQzlNalQyU2tVVURhSDJ2SHBjQ25wcGxjeVFtc1QtX1loeG1xZAGtpTkxIWlkw'
        })
        axios({
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
            url: '  https://api.github.com/search/topics',
            params: {
                q: 'react',
                page
            }
        }).then(res => {
            setData([...data, ...res.data.items])
            setNext(res.data && !res.data.incomplete_results)
            setPage(page + 1)
            console.log(res)
        }).catch(e => {
            console.log(e)
        })
    }

    const columns = getColumnsFromListData(data)


    useEffect(() => {
        fetch();
    }, [])

    console.log(data)

    return <div>Test
        <div style={{ overflow: "auto" }}>
            <Table size={'small'} dataSource={data} columns={columns} pagination={false} />
        </div>
        {next && <InViewMonitor onInView={() => {
            fetch()
        }} repeatOnInView={true} intoViewMargin={'15px'} >
            <div>Loading</div>
        </InViewMonitor>}
    </div >
}
