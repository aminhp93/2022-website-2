export * from "./HouseFinance";

export const DATE_FORMAT = "YYYY-MM-DD"
export const BILLION = 1000000000
export const MIN_TOTAL_VOLUME = 100000
export const MIN_TOTAL_VALUE = BILLION * 5
export const MIN_MEDIUM_TOTOL_VALUE = BILLION * 5
export const MAX_MEDIUM_TOTOL_VALUE = BILLION * 500


export const getColumnsFromListData = (data: any) => {
    const columns: any = []

    data && data.length > 0 && Object.keys(data[0]).map((i: any) => {
        if (i === 'post') {
            columns.push({
                title: i,
                dataIndex: i,
                key: i,
                render: (key) => {
                    const div = document.createElement('div')
                    div.innerText = key.title
                    return div
                }
            })
        } else {
            columns.push({
                title: i,
                dataIndex: i,
                key: i
            })
        }
    })

    return columns

}
