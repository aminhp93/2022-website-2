import { Modal, Button } from "antd";
import { useEffect, useState } from 'react'
import { connect } from 'react-redux';

import {
    postAuthToken,
    fetchOrdersHistory
} from "../../reducers/account"

interface TProps {
    onClose?: any;
    postAuthToken?: any;
    fetchOrdersHistory?: any;
}

function HistoryTrade(props: TProps) {
    const { onClose } = props;

    const getHistoryTrade = async () => {
        const res = await props.postAuthToken()
        const res2 = await props.fetchOrdersHistory(res.data.token, "2019-01-01", "2021-09-03");

    }

    const handleOk = () => {

    }

    const handleCancel = () => {
        onClose()
    }

    useEffect(() => {
        getHistoryTrade();
    }, [])

    return (
        <Modal title="HistoryTrade" visible={true} onOk={handleOk} onCancel={handleCancel}>
            <div>HistoryTrade</div>
        </Modal>
    )


}

const mapDispatchToProps = {
    postAuthToken,
    fetchOrdersHistory,
}

export default connect(null, mapDispatchToProps)(HistoryTrade)