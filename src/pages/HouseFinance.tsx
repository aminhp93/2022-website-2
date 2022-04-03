import { Table } from 'antd';
import { times, keyBy, sumBy } from 'lodash';

interface IHouseFinance {
    ten: string,
    tongGiaTri: number,
    laiVay: number,
    tiLeVay: number,
    thoiGianVay: number,
    thoiGianBan: number,
    tiLeBan: number,
    laiPhatTraTruoc: number,
    tienTraBanDau?: number,
    tienTraHangThang?: number,
    tienBan?: number,
    tienGocDaTra?: number,
    tongGocConlai?: number,
    tienLaiDaTra?: number,
    tongTienVay?: number,
    tongTienDaTra?: number,
    tienConPhaiTra?: number,
    tongThu?: number,
    tongTra?: number,
    laiLo?: number,
}

export default function HouseFinance() {

    const calculate = (data: any) => {
        data.map((i: IHouseFinance) => {
            const tienGoc = i.tongGiaTri / i.thoiGianVay;
            let giaTriConlai = i.tongGiaTri
            const listTienTra: any = []
            times(i.thoiGianVay).map((j: any, index: number) => {
                if (index !== 0) {
                    giaTriConlai = giaTriConlai - tienGoc
                }
                const tienLai = giaTriConlai * i.laiVay / 12

                listTienTra.push({
                    thang: index + 1,
                    tienGoc,
                    tienLai
                })
            })

            console.log(47, listTienTra)
            i.tienTraBanDau = 1
            i.tienTraHangThang = 1
            i.tienBan = i.tongGiaTri * i.tiLeBan
            i.tienGocDaTra = i.thoiGianBan * tienGoc
            i.tongGocConlai = i.tongGiaTri - i.thoiGianBan * tienGoc
            i.tienLaiDaTra = sumBy(listTienTra.filter((j: any) => j.thang < i.thoiGianBan + 1), 'tienLai')
            i.tongTienDaTra = i.tienGocDaTra + i.tienLaiDaTra
            i.tienConPhaiTra = i.tongGocConlai * (1 + i.laiPhatTraTruoc)
            i.tongTra = i.tongTienDaTra + i.tienConPhaiTra
            i.tongThu = i.tienBan
            i.laiLo = i.tongThu - i.tongTra
            return i
        })
        return data
    }

    const listData2: IHouseFinance[] = [
        {
            ten: "nha",
            tongGiaTri: 4000,
            laiVay: 0.1,
            tiLeVay: 1,
            thoiGianVay: 240,
            thoiGianBan: 12,
            tiLeBan: 1.1,
            laiPhatTraTruoc: 0.02
        },
        {
            ten: "oto",
            tongGiaTri: 700,
            laiVay: 0.1,
            tiLeVay: 0.5,
            thoiGianVay: 240,
            thoiGianBan: 60,
            tiLeBan: 1.5,
            laiPhatTraTruoc: 0.02
        }
    ]

    const calculatedListdata2 = calculate(listData2)

    let dataSource: any = []
    let objListData2: any = keyBy(calculatedListdata2, 'ten')
    Object.keys(calculatedListdata2[0]).map((i: any) => {
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

    const data = calculatedListdata2[0]

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

    // const columns = [
    //     {
    //         title: 'thang',
    //         dataIndex: 'thang',
    //         key: 'thang',
    //     },
    //     {
    //         title: 'tienGoc',
    //         dataIndex: 'tienGoc',
    //         key: 'tienGoc',
    //     },
    //     {
    //         title: 'tienLai',
    //         dataIndex: 'tienLai',
    //         key: 'tienLai',
    //     },
    // ];

    const columns: any = []

    Object.keys(dataSource[0]).map((i: any) => {

        columns.push({
            title: i,
            dataIndex: i,
            key: i
        })
    })
    console.log(columns)

    let tienPhaiTraConLai = 0;
    let tongTienDaTra = 0;

    listTienTra.map((i: any) => {
        if (i.thang > 60) return;
        tongTienDaTra += i.tienGoc + i.tienLai
    })
    tienPhaiTraConLai = data.tongGiaTri - 60 * tienGoc
    console.log(dataSource)
    return <div>
        HouseFinance
        {/* <div style={{ height: "500px", overflow: "auto" }}>
            <Table dataSource={listTienTra} columns={columns} pagination={false} />
        </div> */}
        <div>
            Sau 60 thang so tien phai tra:
            <div>So tien phai tra con lai: {tienPhaiTraConLai} </div>
            <div>Tong tien da tra: {tongTienDaTra}</div>
        </div>
        <div style={{ overflow: "auto" }}>
            <Table size={'small'} dataSource={dataSource} columns={columns} pagination={false} />
        </div>

    </div>
}
