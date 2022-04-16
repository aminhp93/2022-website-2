import { useState } from 'react';
import { Table, Button } from 'antd';
import { times, keyBy } from 'lodash';
import { mapListDataHouseFinance, listDataHouseFinance } from 'utils';


export default function HouseFinance() {
    const [showListIienTra, setShowListIienTra] = useState(false);
    const mappedData = mapListDataHouseFinance(listDataHouseFinance)

    let dataSource: any = []
    let objListData2: any = keyBy(mappedData, 'ten')
    Object.keys(mappedData[0]).map((i: any) => {
        if (i !== 'ten') {
            let item: any = {
                ten: i
            }
            Object.keys(objListData2).map((j: any) => {
                item[j] = objListData2[j][i]
            })
            dataSource.push(item)
        }
    })

    const data = mappedData[0]

    const listTienTra: any = []
    const tienGoc = data.tongGiaTri / data.thoiGianVay;
    let giaTriConlai = data.tongGiaTri
    times(data.thoiGianVay).map((i: any, index: number) => {
        if (index !== 0) {
            giaTriConlai = giaTriConlai - tienGoc
        }

        const tienLai = giaTriConlai * data.laiVay / 12
        listTienTra.push({
            thang: index + 1,
            tienGoc,
            tienLai
        })
    })

    const columns: any = []

    Object.keys(dataSource[0]).map((i: any) => {
        console.log(i)
        if (i === "nha") {
            columns.push({
                title: i,
                render: (data) => {
                    if (data.ten === "laiVay") {
                        return <div>{data.nha * 100}%</div>
                    } else if (data.ten === "tiLeVay") {
                        return <div>{data.nha * 100}%</div>
                    } else if (data.ten === "thoiGianVay") {
                        return <div>{data.nha} thang</div>
                    } else if (data.ten === "thoiGianBan") {
                        return <div>{data.nha} thang</div>
                    } else if (data.ten === "tiLeBan") {
                        return <div>{Number(data.nha * 100).toFixed(0)}%</div>
                    } else if (data.ten === "laiPhatTraTruoc") {
                        return <div>{data.nha * 100}%</div>
                        // } else if (data.ten === "tienTraBanDau") {
                        //     return <div>{data.nha * 100}%</div>
                        // } else if (data.ten === "tienTraHangThang") {
                        //     return <div>{data.nha * 100}%</div>
                    } else {
                        return <div>{data.nha}</div>
                    }
                }
            })
        } else if (i === "oto") {
            columns.push({
                title: i,
                render: (data) => {
                    if (data.ten === "laiVay") {
                        return <div>{data.oto * 100}%</div>
                    } else if (data.ten === "tiLeVay") {
                        return <div>{data.oto * 100}%</div>
                    } else if (data.ten === "thoiGianVay") {
                        return <div>{data.oto} thang</div>
                    } else if (data.ten === "thoiGianBan") {
                        return <div>{data.oto} thang</div>
                    } else if (data.ten === "tiLeBan") {
                        return <div>{Number(data.oto * 100).toFixed(0)}%</div>
                    } else if (data.ten === "laiPhatTraTruoc") {
                        return <div>{data.oto * 100}%</div>
                    } else {
                        return <div>{data.oto}</div>
                    }
                }
            })
        } else {
            columns.push({
                title: i,
                dataIndex: i,
                key: i
            })
        }


    })

    const columns2 = [
        {
            title: 'thang',
            dataIndex: 'thang',
            key: 'thang',
        },
        {
            title: 'tienGoc',
            dataIndex: 'tienGoc',
            key: 'tienGoc',
        },
        {
            title: 'tienLai',
            dataIndex: 'tienLai',
            key: 'tienLai',
        },
    ];

    return <div>
        <Button onClick={() => setShowListIienTra(!showListIienTra)} type={showListIienTra ? "primary" : null} >List tien tra</Button>
        {
            showListIienTra && <div style={{ height: "500px", overflow: "auto" }}>
                <Table dataSource={listTienTra} columns={columns2} pagination={false} />
            </div>
        }

        <div style={{ overflow: "auto" }}>
            <Table size={'small'} dataSource={dataSource} columns={columns} pagination={false} />
        </div>

    </div>
}
