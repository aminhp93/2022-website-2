import { useState, useEffect, useCallback } from 'react';
import { Button, Input, notification } from 'antd';
import axios from 'axios';
import { debounce, } from "lodash";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;

export default function Todos() {
    const [editNote, setEditNote] = useState(false)
    const [note, setNote] = useState(`\n # Write something here for note`);

    const getStockNote = async () => {
        const res: any = await axios({
            url: "https://testapi.io/api/aminhp93/resource/note/3",
            data: {
                title: "stock",
                content: note
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            method: "GET"
        })
        if (res && res.data && res.data.content) {
            setNote(res.data.content)
        }
    }


    const handleChangeNote = (e: any) => {
        debounnceHandleChangeNote(e.target.value)
    }

    const debounnceHandleChangeNote = useCallback(debounce((value) => {
        if (value) {
            axios({
                url: "https://testapi.io/api/aminhp93/resource/note/3",
                data: {
                    title: "stock",
                    content: value
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                method: "PUT"
            }).then(res => {
                // console.log(res)
            }).catch(error => {
                notification.error({ message: "Error Update Note" })
            })
        }
        setNote(value)

    }, 1000), [])

    useEffect(() => {
        getStockNote();
    }, [])

    return <div>Todos
        <div style={{ textAlign: "start" }}>
            <Button onClick={() => setEditNote(!editNote)}>
                {editNote ? 'Edit' : 'Not edit'}
            </Button>
            {editNote
                ? <TextArea
                    // onPressEnter={() => setEditNote(false)}
                    defaultValue={note} onChange={handleChangeNote} />
                : <ReactMarkdown children={note} />
            }
        </div>
    </div>
}
