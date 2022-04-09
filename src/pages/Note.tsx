import { useState, useEffect } from 'react';
import { Button, notification, Spin, Input, Table } from 'antd';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import { getColumns } from 'helpers/utils'

function getId(key: string) {
    if (key === "todos") {
        return "3"
    } else if (key === "stock") {
        return "1"
    } else if (key === "insightOutsourcing") {
        return "4"
    } else if (key === "storyTellerBusiness") {
        return "5"
    } else {
        return null
    }
}

interface IProps {
    title?: string;
    management?: boolean;
}

export default function Note({ title, management }: IProps) {
    const id = getId(title)
    const [canEdit, setCanEdit] = useState(false)
    const [note, setNote] = useState(`\n # Write something here for note`);
    const [tempNote, setTempNote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmCreateNote, setConfirmCreateNote] = useState(false);
    const [titleCreateNote, setTitleCreateNote] = useState(null);
    const [listNotes, setListNotes] = useState([]);

    const columns = getColumns(listNotes)

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

    const handleCreateNote = async () => {
        try {
            await axios({
                url: `https://testapi.io/api/aminhp93/resource/note/`,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                data: {
                    title: titleCreateNote
                },
                method: "POST"
            })

            setConfirmCreateNote(false)
            getListNotes()
        } catch (e) {
            notification.error({ message: "error" })
        }

    }

    const getListNotes = async () => {
        try {
            const res = await axios({
                url: `https://testapi.io/api/aminhp93/resource/note/`,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },

            })
            if (res?.data?.data) {
                setListNotes(res.data.data)
            }
        } catch (e) {
            notification.error({ message: "error" })
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

    const handleChangeNote = (e: any) => {
        setTitleCreateNote(e.target.value)
    }

    const renderNote = () => {
        return (canEdit
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
        )
    }

    useEffect(() => {
        // getStockNote();
        getListNotes()
    }, [])

    if (loading) return <Spin />

    return <div className="Note">
        {
            management ?
                <>
                    <div>NOTE MANAGEMENT</div>
                    {
                        confirmCreateNote
                            ? <>
                                <Input onChange={handleChangeNote} />
                                <Button onClick={() => handleCreateNote()}>Confirm</Button>
                                <Button onClick={() => setConfirmCreateNote(false)}>Cancel</Button>
                            </>
                            : <Button onClick={() => setConfirmCreateNote(true)}>Create Note</Button>
                    }
                    <div style={{ overflow: "auto" }}>
                        <Table size={'small'} dataSource={listNotes} columns={columns} pagination={false} />
                    </div>
                </>
                : renderNote()
        }
    </div>
}
