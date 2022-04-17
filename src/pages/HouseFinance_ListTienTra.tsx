import { useState } from 'react';
import { Table, Button } from 'antd';
import { times, keyBy } from 'lodash';
import CustomModal from 'components/CustomModal'

export default function HouseFinance_ListTienTra({ data }) {
    const columns = [
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

    const [showListIienTra, setShowListIienTra] = useState(false);


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

    return <div>
        <Button onClick={() => setShowListIienTra(!showListIienTra)} type={showListIienTra ? "primary" : null} >List tien tra</Button>
        {
            showListIienTra && <CustomModal onCancel={() => setShowListIienTra(false)}>
                <div style={{ height: "500px", overflow: "auto" }}>
                    <Table dataSource={listTienTra} columns={columns} pagination={false} />
                </div>
            </CustomModal>
        }
    </div>
}