import { useState, useEffect } from 'react';
import { Button, notification, Spin } from 'antd';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';

function getId(key: string) {
    if (key === "todos") {
        return "3"
    } else if (key === "stock") {
        return "1"
    } else {
        return null
    }
}

export default function Note({ title }: any) {
    const id = getId(title)
    const [canEdit, setCanEdit] = useState(false)
    const [note, setNote] = useState(`\n # Write something here for note`);
    const [tempNote, setTempNote] = useState(null);
    const [loading, setLoading] = useState(false);

    const getStockNote = async () => {
        setLoading(true)
        const res: any = await axios({
            url: `https://testapi.io/api/aminhp93/resource/note/${id}`,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            method: "GET"
        })
        setLoading(false)
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
            url: `https://testapi.io/api/aminhp93/resource/note/${id}`,
            data: {
                title,
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

    if (loading) return <Spin />

    return <div className="Note">
        {
            canEdit
                ? <div style={{ height: "100%" }}>
                    <div style={{ height: "50px" }}>
                        <Button type="primary" onClick={handleConfirm}>
                            Confirm
                        </Button>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                    <div style={{ flex: 1 }}>

                        <MDEditor
                            height={500}
                            value={tempNote}
                            onChange={setTempNote}
                        />
                    </div>

                </div>
                : <div style={{ height: "100%" }}>
                    <div style={{ height: "50px" }}>
                        <Button type="primary" danger onClick={handleUdpate}>
                            Update
                        </Button>
                    </div>
                    <div style={{ flex: 1 }}>
                        <MDEditor.Markdown source={note} />
                    </div>
                </div>
        }
    </div>
}
