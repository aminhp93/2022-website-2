import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Timeline, Modal } from 'antd';

export default function StockEvent() {
    const listEvents = [
        {
            time: "21-09-2021",
            name: "Evergrande Khung hoang no",
            note: `
             \n - [Link docs](https://www.youtube.com/watch?v=Fw33gICwH1M)
             \n - Thi truong giam diem mo gap
            `
        },
        {
            time: "07-09-2021",
            name: "Thong tu 14/2021",
            note: `
             \n - [https://www.youtube.com/watch?v=-4syULW86eM](https://www.youtube.com/watch?v=-4syULW86eM)
             \n - Lui thoi han tra no cho khach hang. Trich lap du phong ngan hang khong duoc lui thoi han.
            `
        },
        {
            time: "02-04-2021",
            name: "Thong tu 03/2021",
            note: `
             \n - [Link docs](https://luatvietnam.vn/tai-chinh/thong-tu-03-2021-tt-nhnn-quy-dinh-co-cau-lai-thoi-han-tra-no-ho-tro-khach-hang-chiu-anh-huong-boi-dich-covid-19-200630-d1.html)
             \n - 
            `
        },
        {
            time: "19-01-2021",
            name: "Thong tu 01/2021",
            note: `
             \n - [Link docs](http://www.chinhphu.vn/portal/page/portal/chinhphu/hethongvanban?class_id=1&mode=detail&document_id=99777)
             \n - 
            `
        },


    ]

    return <div>
        <Timeline mode={'left'}>
            {
                listEvents.map((i: any) => {
                    return <Timeline.Item>
                        <StockEventItem data={i} />
                    </Timeline.Item>
                })
            }

        </Timeline>
    </div>
}

interface StockEventItemProps {
    data: any;
}

function StockEventItem({ data }: StockEventItemProps) {
    const [modal, setModal] = useState(false)
    return <>
        <div onClick={() => setModal(true)} >
            {data.time} - {data.name}
        </div>
        {modal && <Modal visible={true} onCancel={() => setModal(false)} footer={null} >
            <ReactMarkdown>
                {data.note}
            </ReactMarkdown>
        </Modal>}
    </>
}