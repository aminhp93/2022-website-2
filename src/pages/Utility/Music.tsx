import axios from "axios";
import { useEffect } from "react";
import fs from "fs";
import { Upload, message, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import React from "react";
// import MDEditor from '@uiw/react-md-editor';

export default function Music() {
    const test = async () => {
        // const res = await axios({
        //     url: "https://api.imgur.com/3/image/{{imageHash}}",
        //     headers: {
        //         Authorization: 'Client-ID '
        //     },
        //     data: {
        //         image: fs.readFileSync(img_path, "base64"),
        //         type: "base64",
        //         description: "123"
        //       }
        // })
    }

    const props = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info: any) {
            console.log(info)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


    useEffect(() => {
        test()
    }, [])
    return <div>
        {/* <MDEditor.Markdown source={`
                \n - Đang yêu:
                \n   - [Đúng người đúng thời điểm](https://www.youtube.com/watch?v=2MZ_oQOGC24)
                \n   - [Tây Vương Nữ Quốc](https://www.youtube.com/watch?v=J9uBBbPPhdE) 
                \n   - [Mộng uyên ương hồ điệp](https://www.youtube.com/watch?v=RFUfg_tswIs)
                \n   - [Ánh trăng tình ái](https://www.youtube.com/watch?v=DsDEGuFwzq0)

                \n - Gọi thức dậy:
                \n   - [Europe's Skies - Alexander Rybak](https://www.youtube.com/watch?v=daqfr6DJsGc)
            `} /> */}


        <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
    </div>
}