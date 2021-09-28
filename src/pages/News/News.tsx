import axios from 'axios'
import { useEffect, useState } from 'react';

export default function News() {
    const [quote, setQuote] = useState(null)
    const getCovid = async () => {

        const res = await axios({
            method: 'GET',
            url: 'https://api.quotable.io/random',



        })
        if (res && res.data) {
            setQuote(res.data)
        }
    }

    useEffect(() => {
        getCovid();
    }, [])

    return <div>
        News
        <div>
            Today Quote
        </div>
        {quote &&
            <div>{quote.content} - {quote.author} </div>
        }
        <div>Saved quote: {`Một người chưa từng trải qua hôn nhân và con cái thì chưa trải qua hạnh phúc.`}</div>
    </div>
}