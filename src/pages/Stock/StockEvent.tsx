import { useEffect, useState } from "react";
import { Timeline, Modal, notification, Input, DatePicker } from 'antd';
import MDEditor from '@uiw/react-md-editor';
import axios from "axios";
import { Spin, Button } from "antd";
import moment from 'moment';

export default function StockEvent() {
    const [modal, setModal] = useState(false);
    const [listEvents, setListEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tempEvent, setTempEvent] = useState({} as any);

    const fetch = async () => {
        const res: any = await axios({
            url: `https://testapi.io/api/aminhp93/resource/events/`,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            method: "GET"
        })
        setLoading(false)
        if (res && res.data && res.data.data) {
            setListEvents(res.data.data)
        }
    }

    const handleConfirmCreate = async () => {
        try {
            setLoading(true)
            await axios({
                url: `https://testapi.io/api/aminhp93/resource/events/`,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                method: "POST",
                data: tempEvent
            })
            fetch()
            setModal(false)
            setTempEvent({})
            setLoading(false)
            notification.success({ message: "Success" })
        } catch (e) {
            setLoading(false)
            notification.error({ message: "Error" })
        }
    }

    const handleUpdateTitle = (e: any) => {
        setTempEvent({ ...tempEvent, title: e.target.value })
    }

    const handleUpdateDate = (e: any) => {
        setTempEvent({ ...tempEvent, time: e.format('YYYY-MM-DD') })
    }

    const handleUpdateContentEvent = (e: any) => {
        setTempEvent({ ...tempEvent, content: e })
    }

    useEffect(() => {
        fetch()
    }, [])

    if (loading) return <Spin />
    return <div>
        {
            modal
                ? <Modal visible={true} onCancel={() => setModal(false)} footer={null} >
                    <div>
                        <div style={{ height: "50px" }}>
                            <Button type="primary" onClick={handleConfirmCreate}>
                                Confirm
                            </Button>
                            <Button onClick={() => setModal(false)}>
                                Cancel
                            </Button>
                        </div>
                        <div>
                            <Input onChange={handleUpdateTitle} />
                            <DatePicker onChange={handleUpdateDate} defaultValue={moment()} />
                            <MDEditor
                                height={500}
                                value={tempEvent.content}
                                onChange={handleUpdateContentEvent}
                            />
                        </div>
                    </div>
                </Modal>
                : <>
                    <div style={{ height: "50px" }}>
                        <Button onClick={() => setModal(true)}>Create</Button>
                    </div>

                    <Timeline mode={'left'}>
                        {
                            listEvents.map((i: any) => {
                                return <Timeline.Item style={{ cursor: "pointer" }}>
                                    <StockEventItem data={i} cb={fetch} />
                                </Timeline.Item>
                            })
                        }

                    </Timeline>
                </>
        }
    </div>
}

interface StockEventItemProps {
    data: any;
    cb: any;
}

function StockEventItem({ data, cb }: StockEventItemProps) {
    const [modal, setModal] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [tempEvent, setTempEvent] = useState(data);
    const [event, setEvent] = useState(data);

    const handleConfirmUpdate = async () => {
        try {
            await axios({
                url: `https://testapi.io/api/aminhp93/resource/events/${event.id}/`,
                data: tempEvent,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                method: "PUT"
            })
            setTempEvent({})
            setEvent(tempEvent)
            setCanEdit(false)
            cb && cb()
            notification.success({ message: "Success" })
        } catch (e) {
            notification.error({ message: "Error" })
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await axios({
                url: `https://testapi.io/api/aminhp93/resource/events/${event.id}/`,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                method: "DELETE"
            })
            cb && cb()
            setModal(false)
            notification.success({ message: "Success" })
        } catch (e) {
            notification.error({ message: "Error" })
        }
    }

    const handleUpdateContentEvent = (e: any) => {
        setTempEvent({ ...tempEvent, content: e })
    }

    const handleCancel = () => {
        setTempEvent({})
        setCanEdit(false)
    }

    const handleUpdateTitle = (e: any) => {
        setTempEvent({ ...tempEvent, title: e.target.value })
    }

    const handleUpdateDate = (e: any) => {
        setTempEvent({ ...tempEvent, time: e.format('YYYY-MM-DD') })
    }

    return <>
        <div onClick={() => setModal(true)} >
            {event.time} - {event.title}
        </div>
        {modal && <Modal visible={true} onCancel={() => setModal(false)} footer={null} >
            <div style={{ display: "flex" }}>
                {
                    canEdit
                        ? <div>
                            <div style={{ height: "50px" }}>
                                <Button type="primary" onClick={handleConfirmUpdate}>
                                    Confirm
                                </Button>
                                <Button onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                            <div>
                                <Input defaultValue={tempEvent.title} onChange={handleUpdateTitle} />
                                <DatePicker onChange={handleUpdateDate} defaultValue={moment(tempEvent.time)} />

                                <MDEditor
                                    height={500}
                                    value={tempEvent.content}
                                    onChange={handleUpdateContentEvent}
                                />
                            </div>
                        </div>
                        : (!canDelete && <div>
                            <Button type="primary" danger onClick={() => {
                                setCanEdit(true)
                            }}>Update</Button>
                        </div>)
                }

                {
                    canDelete
                        ? <div>
                            <div style={{ height: "50px" }}>
                                <Button type="primary" onClick={handleConfirmDelete}>
                                    Confirm
                                </Button>
                                <Button onClick={() => setCanDelete(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                        : (!canEdit && <div>
                            <Button style={{ marginLeft: "20px" }} type="primary" danger onClick={() => {
                                setCanDelete(true)
                            }}>Delete</Button>
                        </div>)
                }

            </div>

            {
                (canEdit || canDelete)
                    ? null
                    : <div>
                        <div>{event.time} - {event.title}</div>
                        <MDEditor.Markdown source={event.content} />
                    </div>
            }
        </Modal>}
    </>
}