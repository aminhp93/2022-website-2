import axios from "axios"
import { useEffect } from "react"


export default function Test() {
    const fetch = () => {
        axios({
            method: "GET",
            url: 'http://localhost:3001/grab/'
        }).then(res => {
            console.log(res)
        })
    }

    useEffect(() => {
        fetch()
    }, [])

    return <div>Test

    </div >
}
