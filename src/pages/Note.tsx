import { useState, useEffect } from 'react';
import { Button, notification, Spin, Input, Table } from 'antd';
import axios from 'axios';
import { getColumnsFromListData } from 'utils';
import CustomPlate from 'components/CustomPlate'
import { v4 as uuidv4 } from 'uuid';


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
    const [plateId, setPlateId] = useState(uuidv4())
    const id = getId(title)
    const [note, setNote] = useState([
        {
            children: [
                { text: 'hello' }
            ],
            type: 'h1'
        },
        {
            children: [
                { text: 'paragrahph' }
            ],
            type: 'p'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [confirmCreateNote, setConfirmCreateNote] = useState(false);
    const [titleCreateNote, setTitleCreateNote] = useState(null);
    const [listNotes, setListNotes] = useState([]);

    const columns = getColumnsFromListData(listNotes)

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
            setNote(JSON.parse(res.data.content))
            setPlateId(uuidv4())
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

    const handleUpdate = async () => {
        await axios({
            url: `https://testapi.io/api/aminhp93/resource/note/${id}`,
            data: {
                title,
                content: JSON.stringify(note)
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            method: "PUT"
        }).then(res => {
            // console.log(res)
            notification.success({ message: "Update Note successfully" })
        }).catch(error => {
            notification.error({ message: "Error Update Note" })
        })
    }

    const handleChangeNote = (e: any) => {
        setTitleCreateNote(e.target.value)
    }

    const handleChange = (e) => {
        setNote(e)
    }

    const renderNote = () => {
        return <div style={{ height: "100%" }}>
            <div style={{ height: "50px" }}>
                <Button type="primary" danger onClick={handleUpdate} style={{ position: "fixed", top: "20px", right: "20px" }}>
                    Update
                </Button>
            </div>
            <div style={{ flex: 1 }}>
                <CustomPlate
                    id={String(plateId)}
                    value={note}
                    onChange={handleChange}
                />
            </div>
        </div>
    }

    useEffect(() => {
        if (management) {
            getListNotes()
        } else {
            getStockNote();
        }
    }, [management])

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
