import { useState, useEffect } from "react";
import { Input, Table } from "antd";
import ReactMarkdown from "react-markdown";
import StockService from '../../../services/stock';
import { analyseData, findSellDate, singleColumns, combinedColumns, findBuyDate, testVariableColumns } from "../StockTestBreak/StockTestBreak.helpers"

export default function StockBuyCheck() {
    const [symbol, setSymbol] = useState('');
    const [fundamental, setFendamental] = useState({} as any)

    const fetch = async () => {
        const res = await StockService.getFundamental(symbol);
        if (res && res.data) {
            setFendamental(res.data)
        }

    }

    const handleChange = (e: any) => {
        setSymbol(e.target.value)
    }



    useEffect(() => {
        fetch();
    }, [])

    const eps = fundamental.eps && fundamental.eps.toFixed(0)

    return <div>StockBuyCheck
        <ReactMarkdown>
            {`
            \n - Basic indexes:
            \n   - EPS
            \n   - ROE
            \n   - Doanh thu
            \n   - Loi nhuan cung ky
            \n   - Co tuc gan nhat
            \n - Second level:
            \n   - Check number of break with > 50% volume, price > 4%
            `}
        </ReactMarkdown>
        <Input value={symbol} onChange={handleChange} onPressEnter={fetch} />
        <div>
            EPS: {eps}
        </div>
        <div>

        </div>

    </div>
}
