import axios from 'axios'
import { useEffect, useState } from "react"
import { Table } from 'antd';
import InViewMonitor from 'react-inview-monitor';
import { getColumns } from 'helpers/utils'

export default function Test() {

    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [next, setNext] = useState(false)
    const [page, setPage] = useState(1)

    const fetch = () => {
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

    const columns = getColumns(data)


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
