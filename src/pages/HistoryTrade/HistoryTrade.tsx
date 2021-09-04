import { Modal, Table, Button } from "antd";
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from "moment";
import { sum } from "lodash";

import {
    postAuthToken,
    fetchOrdersHistory
} from "../../reducers/account"
import './HistoryTrade.css';

interface TProps {
    onClose?: any;
    postAuthToken?: any;
    fetchOrdersHistory?: any;
}

function HistoryTrade(props: TProps) {
    const { onClose } = props;

    const filterObj = {
        startDate: "2021-07-01",
        endDate: "2021-09-03",
        orderStatus: "4",
    }

    const [listOrdersHistory, setListOrdersHistory] = useState([])
    const defaultColumns: any = [
        {
            title: 'So hieu lenh',
            dataIndex: 'orderID',
            key: 'orderID',
            width: 200
        },
        {
            title: 'Ngay',
            align: 'right' as 'right',
            render: (data: any) => {
                return moment(data.transactionDate).format("YYYY-MM-DD")
            }
        },
        {
            title: 'Ma CK',
            align: 'center' as 'center',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: 'Lenh',
            align: 'center' as 'center',
            render: (data: any) => {
                if (data.execType === "NB") {
                    return <div style={{ color: "green" }}>Mua</div>
                } else if (data.execType === "NS") {
                    return <div style={{ color: "red" }}>Ban</div>
                } else {
                    return ""
                }
            }
        },
        {
            title: 'KL dat',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.orderQuantity && (Number(data.orderQuantity)).toLocaleString("en-US")
            }
        },
        {
            title: 'Gia dat',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.orderPrice && (Number(data.orderPrice)).toLocaleString("en-US")
            }
        },
        {
            title: 'KL khop',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.matchQuantity && (Number(data.matchQuantity)).toLocaleString("en-US")
            }
        },
        {
            title: 'Gia khop TB',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.matchAveragePrice && (Number(data.matchAveragePrice)).toLocaleString("en-US")
            }
        },
        {
            title: 'Trang thai',
            render: (data: any) => {
                if (data.orderStatus === "4") {
                    return "Khop"
                } else if (data.orderStatus === "5") {
                    return "Lenh het han"
                } else {
                    return ""
                }
            }
        },
        {
            title: 'Phi',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.feeOrder && (data.feeOrder).toLocaleString("en-US")
            }
        },
        {
            title: 'Thoi gian',
            render: (data: any) => {
                return data.orderTime
            }
        },
    ];

    const mainColumns: any = [
        {
            title: 'Ngay',
            align: 'right' as 'right',
            render: (data: any) => {
                return moment(data.transactionDate).format("YYYY-MM-DD")
            }
        },
        {
            title: 'Ma CK',
            align: 'center' as 'center',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: 'Lenh',
            align: 'center' as 'center',
            render: (data: any) => {
                if (data.execType === "NB") {
                    return <div style={{ color: "green" }}>Mua</div>
                } else if (data.execType === "NS") {
                    return <div style={{ color: "red" }}>Ban</div>
                } else {
                    return ""
                }
            }
        },
        {
            title: 'KL khop',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.matchQuantity && (Number(data.matchQuantity)).toLocaleString("en-US")
            }
        },
        {
            title: 'Gia khop TB',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.matchAveragePrice && (Number(data.matchAveragePrice)).toLocaleString("en-US")
            }
        },
        {
            title: '+/-',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.finalChange
            }
        },
        {
            title: 'Total Amount',
            align: 'right' as 'right',
            render: (data: any) => {
                return data.initialAmount && (Number(data.initialAmount)).toLocaleString("en-US")
            }
        }
    ]

    const [columns, setColumns] = useState(mainColumns)

    const getHistoryTrade = async () => {
        const res = await props.postAuthToken()
        const res2 = await props.fetchOrdersHistory(res.data.token, filterObj.startDate, filterObj.endDate);
        if (res2.data) {
            const filteredList = res2.data.filter((i: any) => i.orderStatus === filterObj.orderStatus)

            const mappedList = filteredList.map((i: any) => {
                if (i.execType === "NS") {
                    const listResult: any = [];
                    let totalVolume = 0;
                    filteredList.forEach((j: any) => {
                        if (j.symbol === i.symbol && j.execType === "NB" && j.transactionDate < i.transactionDate) {
                            totalVolume += Number(j.matchQuantity)
                            listResult.push(j)
                        }

                        if (totalVolume === i.matchQuantity) return
                    })
                    const start = sum(listResult.map((i: any) => Number(i.matchQuantity) * Number(i.matchAveragePrice)))
                    const end = i.matchQuantity * i.matchAveragePrice
                    i.finalChange = ((end - start) / start * 100).toFixed(2)
                    i.initialAmount = start
                    if (i.symbol === "GMD") {
                        console.log(listResult, end, start, i.finalChange)
                    }
                }

                return i
            })
            setListOrdersHistory(mappedList)
        }
    }

    const handleOk = () => {

    }

    const handleCancel = () => {
        onClose()
    }

    useEffect(() => {
        getHistoryTrade();
    }, [])



    return (
        <Modal title="HistoryTrade" visible={true} onOk={handleOk} onCancel={handleCancel} className="HistoryTradeModal">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    Start Date: {filterObj.startDate}
                </div>
                <div>
                    End Date: {filterObj.endDate}
                </div>
                <div>
                    OrderStatus: {filterObj.orderStatus === "4" ? "Khop" : ""}
                </div>
            </div>

            <Button onClick={() => setColumns(defaultColumns)}>Default Columns</Button>
            <Button onClick={() => setColumns(mainColumns)}>Main Columns</Button>
            <Table
                dataSource={listOrdersHistory}
                columns={columns}
                pagination={false}
                scroll={{ y: 1200 }} />
        </Modal>
    )

}

const mapDispatchToProps = {
    postAuthToken,
    fetchOrdersHistory,
}

export default connect(null, mapDispatchToProps)(HistoryTrade)