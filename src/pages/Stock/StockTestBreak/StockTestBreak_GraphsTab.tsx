import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StockTestBreak_GraphsTab({ data, listDataKey }: any) {
    const listColor = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']
    return <div>
        <LineChart
            width={1000}
            height={800}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="count" />
            <YAxis domain={[100, 130]} />
            <Tooltip />
            <Legend />
            {
                listDataKey.map((i: any, index: number) => {
                    return <Line type="monotone" dataKey={i} stroke={listColor[index]} strokeWidth={2} />
                })
            }
        </LineChart>
    </div >
}
