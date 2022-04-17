import { Table } from 'antd';
import { keyBy } from 'lodash';
import { mapListDataHouseFinance, listDataHouseFinance } from 'utils';
import HouseFinance_ListTienTra from 'pages/HouseFinance_ListTienTra'


export default function HouseFinance() {
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

    const columns: any = []

    Object.keys(dataSource[0]).map((i: any) => {
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
                    } else if (data.ten === "tienTraHangThang") {
                        return <div><HouseFinance_ListTienTra data={mappedData[0]} /></div>
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
                    } else if (data.ten === "tienTraHangThang") {
                        return <div><HouseFinance_ListTienTra data={mappedData[1]} /></div>
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
    console.log(dataSource, columns)

    return <div style={{ overflow: "auto" }}>
        <Table size={'small'} dataSource={dataSource} columns={columns} pagination={false} />
    </div>
}
