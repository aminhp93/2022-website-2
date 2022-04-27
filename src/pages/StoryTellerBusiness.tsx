import { Table, Menu, Dropdown } from 'antd';
import axios from 'axios';
import Note from 'pages/Note';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DownOutlined } from '@ant-design/icons';
import { groupBy, meanBy, orderBy, get } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const CHART_TYPE = {
    barChart: "Bar Chart",
    table: "Table",
}

const CHART_METRIC = {
    likeCount: "Like count",
    commentCount: "Comment count"
}

interface IProps {

}


function StoryTellerBusiness({ }: IProps & RouteComponentProps) {

    return <div>
        <div>StoryTellerBusiness</div>
        <div style={{ overflow: "auto" }}>
            <Note title="storyTellerBusiness" />
        </div>
        {['259242146', '8485609156'].map(i => {
            return <StoryTellerBusinessChart id={i} />
        })}

    </div>
}

export default withRouter(StoryTellerBusiness)

interface IStoryTellerBusinessChartProps {
    id: string;
}

function StoryTellerBusinessChart({ id }: IStoryTellerBusinessChartProps) {
    const [listSearch, setListSearch] = useState([]);
    const [chartType, setChartType] = useState('barChart');
    const [chartMetric, setChartMetric] = useState('likeCount');

    const getListPhoto = (end_cursor: string) => {
        return axios({
            method: "GET",
            url: `http://localhost:3001/get-list-photo`,
            params: {
                end_cursor,
                id
            }
        })
    }

    const getALlListPhoto = async () => {
        let resultAll = []
        let res
        let result
        let end_cursor = 'first'
        let count = 0
        while (end_cursor && count < 2) {
            res = await getListPhoto(end_cursor);
            if (res) {

                let parsedData = (JSON.parse(res.data.message)).data.user.edge_owner_to_timeline_media.edges
                result = parsedData.map(i => {
                    return i.node
                })
                end_cursor = (JSON.parse(res.data.message)).data.user.edge_owner_to_timeline_media.page_info.end_cursor
                count += 1
                console.log(end_cursor, result)
            }
            resultAll = [...resultAll, ...result]
        }

        console.log(resultAll)
        const mappedResult = [];
        resultAll.map(i => {
            const newItem: any = {}
            newItem.id = i.id
            newItem.likeCount = i.edge_media_preview_like.count
            newItem.commentCount = i.edge_media_to_comment.count
            newItem.postedTime = i.taken_at_timestamp
            newItem.mappedPostedTime = moment.unix(i.taken_at_timestamp).format()
            newItem.shortcode = i.shortcode
            mappedResult.push(newItem)
        })
        console.log(mappedResult)
        setListSearch(mappedResult)
    }

    useEffect(() => {
        getALlListPhoto();
        // getListPhoto('')
    }, [])


    const columns = [
        {
            title: 'id',
            render: (data) => {
                return data.id
            }
        },
        {
            title: 'like count',
            render: (data) => {
                return data.likeCount
            }
        },
        {
            title: 'comment count',
            render: (data) => {
                return data.commentCount
            }
        },

        {
            title: 'time',
            render: (data) => {
                return moment.unix(data.postedTime).format()
            }
        },
        {
            title: 'action',
            render: (data) => {
                return <a href={`https://www.instagram.com/p/${data.shortcode}/`} target="_blank" rel="noreferrer" />
            }
        }
    ]
    const renderChartTable = () => {
        return <div style={{ height: "500px", overflow: "auto" }}>
            <Table dataSource={listSearch} columns={columns} pagination={false} />
        </div>
    }

    const renderChartBarChart = () => {
        const mappedListSearch = listSearch.map((i: any) => {
            i[chartMetric] = Number(i[chartMetric])
            return i
        })
        // console.log(groupBy(mappedListCompensationBenchmarks, 'currentJobTitle'))
        const data1 = groupBy(mappedListSearch, 'mappedPostedTime')
        let result = []
        Object.keys(data1).map((i: any) => {
            const item: any = {}
            item.name = i
            item[chartMetric] = Number(meanBy(data1[i], chartMetric).toFixed(0))
            item.fullData = data1[i]
            result.push(item)
        })
        // result = orderBy(result, [chartMetric], ['asc'])
        console.log(result)
        return <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart width={150} height={40} data={result} onClick={(e, data) => {
                    console.log(e, data)
                    window.open(`https://www.instagram.com/p/${e?.activePayload[0]?.payload.fullData[0]?.shortcode}/`, "_blank")
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={chartMetric} fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    }
    const menu = <Menu onClick={(e) => {
        e.domEvent.preventDefault()
        setChartType(e.key)
    }}>
        {Object.keys(CHART_TYPE).map((i: any) => {
            return <Menu.Item key={i}>{CHART_TYPE[i]}</Menu.Item>
        })}
    </Menu>

    const menuProperty = <Menu onClick={(e) => {
        e.domEvent.preventDefault()
        setChartMetric(e.key)
    }}>
        {Object.keys(CHART_METRIC).map((i: any) => {
            return <Menu.Item key={i}>{CHART_METRIC[i]}</Menu.Item>
        })}
    </Menu>
    return <div style={{ marginTop: "20px", background: "white", padding: "20px", borderRadius: "10px" }}>
        <div style={{ height: "50px", display: "flex", justifyContent: "space-between" }} className="CompensationBenchmark-dropdown">
            <div style={{ fontSize: "16px", fontWeight: 600 }}>Data Visualization</div>
            <div style={{ display: "flex" }}>
                <Dropdown overlay={menuProperty} trigger={['click']} placement="bottomRight" >
                    <div style={{ display: "flex", alignItems: "center", marginRight: "20px", cursor: "pointer" }}><DownOutlined style={{ fontSize: '16px', marginRight: "6px" }} /> {CHART_METRIC[chartMetric]}</div>
                </Dropdown>
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" >
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}><DownOutlined style={{ fontSize: '16px', marginRight: "6px" }} /> {CHART_TYPE[chartType]}</div>
                </Dropdown>
            </div>

        </div>
        {
            chartType === "table" && renderChartTable()
        }
        {
            chartType === "barChart" && renderChartBarChart()
        }
    </div>

}