
import ReactMarkdown from 'react-markdown';
import ReactGridLayout from 'react-grid-layout';
import remarkGfm from 'remark-gfm'
import { Table } from 'antd';

import '../../../node_modules/react-grid-layout/css/styles.css'
import '../../../node_modules/react-resizable/css/styles.css'
import News from '../News/News'
import Stock from '../Stock/Stock'
import Todos from '../Todos/Todos'
import { useEffect } from 'react';
import HistoryTrade from "../HistoryTrade/HistoryTrade";

const ResponsiveReactGridLayout = ReactGridLayout.WidthProvider(ReactGridLayout.Responsive);

export default function ReactGridRoot() {
    // layout is an array of objects, see the demo for more complete usage
    const gridItems: any = [
        { id: 1, name: "Item One", component: "Stock" },
        { id: 2, name: "Item Two", component: "Todos" },
        // { id: 3, name: "Item Three" },
        { id: 4, name: "Item Four" },
        { id: 5, name: "Item Five", component: "News" },
        // { id: 6, name: "Item Six" },
        // { id: 7, name: "Item Seven" },
        // { id: 8, name: "Item Eight" },
        // { id: 9, name: "Item Nine" }
    ];
    const layout = [
        { i: '1', x: 0, y: 0, w: 6, h: 6 },
        { i: '2', x: 6, y: 0, w: 6, h: 6 },
        // { i: '3', x: 8, y: 0, w: 3, h: 2 },
        { i: '4', x: 0, y: 6, w: 6, h: 6 },
        { i: '5', x: 6, y: 6, w: 6, h: 6 },
        // { i: '6', x: 8, y: 3, w: 3, h: 2 },
        // { i: '7', x: 0, y: 6, w: 5, h: 2 },
        // { i: '8', x: 5, y: 6, w: 3, h: 2 },
        // { i: '9', x: 8, y: 6, w: 3, h: 2 }
    ];

    const dataSource = [
        {
            key: '1',
            text: '# H1',
        },
        {
            key: '2',
            text: '**bold text**',
        },
        {
            key: '3',
            text: '*italicized text*',
        },
        {
            key: '4',
            text: '> blockquote',
        },
        {
            key: '5',
            text: '1. Ordered item',
        },
        {
            key: '6',
            text: '- Unordered item'
        },
    ];

    const columns = [
        {
            title: 'Element',
            render: (data: any) => {
                return <div><ReactMarkdown children={data.text} remarkPlugins={[remarkGfm]} /></div>
            }
        },
        {
            title: 'Syntax',
            render: (data: any) => {
                return <div>{data.text}</div>
            }
        },
    ];

    const getComponent = (data: any) => {
        if (data.component === "News") {
            return <News />
        } else if (data.component === "Stock") {
            return <Stock />
        } else if (data.component === "Todos") {
            return <Todos />
        } else {
            return <div>
                <Table dataSource={dataSource} columns={columns} pagination={false} />
            </div>
        }
    }

    useEffect(() => {

    }, [])

    return <div>
        <ResponsiveReactGridLayout
            layouts={{ lg: layout }}
            measureBeforeMount={true}
            className="layout"
            // rowHeight={this.props.rowHeight}
            // isDragable={true}
            isResizable={true}
            // onDrag={this.onDragging}
            // onDragStop={this.onMoveCard}
            // onResizeStop={this.onResizeCard}
            margin={[0, 0]}
        >
            {gridItems.map((item: any, i: any) => {
                return (
                    <div key={item.id} className="grid-item">{getComponent(item)}</div>
                );
            })}
        </ResponsiveReactGridLayout>
    </div>
}
