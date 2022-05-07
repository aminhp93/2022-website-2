
// server/index.js
const qs = require('qs');
const express = require("express");
const axios = require('axios');
const cors = require('cors')

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors())

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

const headers = {
    'authority': 'www.instagram.com',
    'accept': '*/*',
    'accept-language': 'vi-VN,vi;q=0.9,fr;q=0.8,en-US;q=0.7,en;q=0.6',
    'cache-control': 'no-cache',
    'cookie': 'ig_did=6BD456A6-31C1-4748-BA9A-DB929DA68CC7; mid=XhScXwAEAAGzwNetR2pVnCi8Z9kD; fbm_124024574287414=base_domain=.instagram.com; ig_nrcb=1; csrftoken=FRZA2FEjKVhodOQ2hWVm3fSf65zJ4nT6; ds_user_id=1535011497; sessionid=1535011497%3AwX0LKb1apTfr30%3A26; ig_lang=en; shbid="1993\\0541535011497\\0541682329816:01f7a920bacbe7195c48c72e181bddbf9fb4a34c0c26fe42b639f0f9521ae58c3aec5fb4"; shbts="1650793816\\0541535011497\\0541682329816:01f70c481b83ff24c05b5fc8122131b4604bf7b11c3688f2156c376142a87c6be50e49b7"; fbsr_124024574287414=h37acEw5nnbAang9Vf6ScyXgnHIbxokYbn4MPP2_etE.eyJ1c2VyX2lkIjoiMTAwMDAwMzc2NDc5NTUwIiwiY29kZSI6IkFRQmxUNHZ5d2lvSFY4MDFHX0Q0MTdIWWNsVDVhMDAtYzJNWm44S05scXc2S3RtdEpRbEMwYTZjZWVjWXo4WE1wenc2Ykk4dGcyN1BpcElDNm5GWm44MXIzdXlPQ1RnUVFJWEtkMzE0RFBybDYzMmNCWUhMUlZXR1VJZEJqakNqU05rSWVPbmNRbWVSblBQeFpZclhVbWlkZ1ZPNnRia3A2RDJXWUtObkV3eTgyS2w2MmRmQThiV2I5SEhpSVhWb2swNEZja2FDSmY2ZC1MWFB6bHpUZ3M3RU9fT0xrV1FLRW1zLThDQ1BjcWlsVEpvckRqRXFTZTZlaEVhVWloN3FYQTFNeDl6WVc0TlV2WlNCV1BlV3hhVURPQkJWZFZvYTZPVTRWbmFOX1o4OFhwN2s4MFQ5alFESG43NnpfMGMwR19HMWZUWnpZaGV2d1BtdjgtZkJTVlZpIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUFqR1JiaTNoQlAzd09SSG5OUkpyeDNaQTlXQnVQNExCWFI1NnY5QlloeXcxNXRIbXprUUxYQXFlWFczTFFpY25CRERvTlNaQTJ6QW5XS0g3MUY5VVFaQzFLMW5lblNPUXkyVmZYQzk0RDI1RzlDUjY3djRrT2g4NjV0WVU2RnJBTTE4ckpjdmlqVzdWWkFsRkFNRlF6WWUxNHhWc2tjemtRV2RGUXdHIiwiYWxnb3JpdGhtIjoiSE1BQy1TSEEyNTYiLCJpc3N1ZWRfYXQiOjE2NTA5NjA3MzJ9; fbsr_124024574287414=5Rv1o_jtyTIw22kpbqra7ja3aqxZ4HHR1Sa_R5XLRKE.eyJ1c2VyX2lkIjoiMTAwMDAwMzc2NDc5NTUwIiwiY29kZSI6IkFRRDJoVkVmTUJRRGJRUmNkSTA2Zkx3dXhPc3FwRTF2RU1JZWhPXzVnQ3d5cWtkV0plTHVBVEl4enhZNElpQTVmR0pyclJ5OVc3Y2ZHTkFlcGhnR2hqYW5kX3VyOXdUbExoRzFWNDN4YnpzbXdvUmQzVktoaEY1STZqUWVieXFPM01lam96MDFITGVFblFsN014Qml3M3lMTW52cGJFYmh0NXVocjlIaXZtUEtraVQ5RmlGY2VqRlpPdV9PZW1WT25YQXhwQ3FBWGkzY295ekNwcTlWcGpRWHVsRUZYbUtxVmFnMHJqYVVYRkdKYjZqZ216Qlc0YURfbHplZWF1X1d6YWJGMV8zQWJtblEtMF82SVFGU1lmcnhVZFZwVXV1UmgzTEZXeENoVlpVbWRRU2VTS2tBbkZ5RFNEZ2I3WmJHVVBmVjJpUFRJVnJLVjNwd21aWERDWUp4Iiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUt2WkNxcEpqRzJjQmNDeDFWM3FwWkNCaFNDQ3V2cmN6dmd0ZExnME1HdERJYk5Nb3ExSFZzRWx1S2xJa1R6UDVSV3h4alNaQlpCZHhiMm5ma3EzNTlna1NMQ0N6a1pDdkpSWUJldGdTVHFkeUNkRW5pWkFKcURFWkNpMXFoTVpDcHhxVTExWWR4aXhoWGp4ZHE4WWwyRlJ1U0xEcE9lZWNRa1F2QzRNdVlqTCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjUwOTYzNTA2fQ; rur="NAO\\0541535011497\\0541682499559:01f751874d53eb88acca9f159129f90843aa07453d433c7bf34d5e4b7ef711b6fc9dfb6e"',
    'pragma': 'no-cache',
    'referer': 'https://www.instagram.com/liti.florist/',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'x-asbd-id': '198387',
    'x-csrftoken': 'FRZA2FEjKVhodOQ2hWVm3fSf65zJ4nT6',
    'x-ig-app-id': '936619743392459',
    'x-ig-www-claim': 'hmac.AR28Sj8dwtf6Y5Gqr0zbPFy4LNn1R7nDfEa4tzWihYINdXqd',
    'x-requested-with': 'XMLHttpRequest'
}

app.get("/api", (req, res) => {
    axios({
        url: 'https://www.instagram.com/web/search/recent_searches/',
        method: "GET",
        headers
    }).then(res2 => {
        console.log(res2, res2.data)
        res.status(200).json({ message: JSON.stringify(res2.data) });
    }).catch(e => {
        console.log(e)
    })
})

app.get("/api", (req, res) => {
    axios({
        url: 'https://i.instagram.com/api/v1/fbsearch/accounts_recs/?target_user_id=1563611178&include_friendship_status=true',
        method: "GET",
        headers
    }).then(res2 => {
        console.log(res2, res2.data)
        res.status(200).json({ message: JSON.stringify(res2.data) });
    }).catch(e => {
        console.log(e)
    })
})

app.get("/get-list-photo", (req, res) => {
    const end_cursor = req.query.end_cursor
    const id = req.query.id
    const query_hash = '69cba40317214236af40e7efa697781d'
    const obj = {
        "id": id,
        "first": "50",
    }
    if (end_cursor === "first") {
        // 
    } else {
        obj.after = end_cursor
    }

    const variables = encodeURI(JSON.stringify(obj))
    axios({
        url: `https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables=${variables}`,
        method: "GET",
        headers,
    }).then(res2 => {
        console.log('==================', res2, res2.data)
        res.status(200).json({ message: JSON.stringify(res2.data) });
    }).catch(e => {
        console.log('==================e', e)
        res.status(400).json({ message: JSON.stringify(e) });
    })
})

app.get("/get-feed-insta/", (req, res) => {
    axios({
        url: 'https://i.instagram.com/api/v1/feed/timeline/',
        method: "POST",
        headers,
        data: {
            device_id: '6BD456A6-31C1-4748-BA9A-DB929DA68CC7',
            is_async_ads_rti: 0,
            is_async_ads_double_request: 0,
            rti_delivery_backend: 0,
            is_async_ads_in_headload_enabled: 0
        }
    }).then(res2 => {
        console.log(res2, res2.data)
        res.status(200).json({ message: JSON.stringify(res2.data) });
    }).catch(e => {
        console.log(e)
    })

});

app.get("/get-story-insta/", (req, res) => {
    axios({
        url: 'https://i.instagram.com/api/v1/feed/reels_tray/',
        method: "GET",
        headers,
    }).then(res2 => {
        console.log(res2, res2.data)
        res.status(200).json({ message: JSON.stringify(res2.data) });
    }).catch(e => {
        console.log(e)
    })

});

app.get('/get-detail/', (req, res) => {
    axios({
        url: 'https://i.instagram.com/api/v1/media/1592136864260595383/info/',
        method: "GET",
        headers
    }).then(res2 => {
        console.log(res2, res2.data)
        res.status(200).json({ message: JSON.stringify(res2.data) });
    }).catch(e => {
        console.log(e)
    })
})
