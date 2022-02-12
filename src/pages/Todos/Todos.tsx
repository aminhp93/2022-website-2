import { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import axios from 'axios';
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

export default function Todos() {
    const [canEdit, setCanEdit] = useState(false)
    const [note, setNote] = useState(`\n # Write something here for note`);
    const [tempNote, setTempNote] = useState(null);

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

    const handleConfirm = async () => {
        let content
        if (!tempNote) {
            content = `\n # Write something here for note`;
        } else {
            content = tempNote;
        }
        await axios({
            url: "https://testapi.io/api/aminhp93/resource/note/3",
            data: {
                title: "stock",
                content
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
        setTempNote(null)
        setNote(content)
        setCanEdit(false)
    }

    const handleCancel = () => {
        setTempNote(null)
        setCanEdit(false)
    }

    const handleUdpate = () => {
        setTempNote(note)
        setCanEdit(true)
    }

    useEffect(() => {
        getStockNote();
    }, [])

    return <div className="Todos">
        {
            canEdit
                ? <div>
                    <MDEditor
                        value={tempNote}
                        onChange={setTempNote}
                    />
                    <Button onClick={handleConfirm}>
                        Confirm
                        </Button>
                    <Button onClick={handleCancel}>
                        Cancel
                        </Button>
                </div>
                : <div>
                    <MDEditor.Markdown source={note} />
                    <Button onClick={handleUdpate}>
                        Update
                    </Button>
                </div>
        }
    </div>
}
