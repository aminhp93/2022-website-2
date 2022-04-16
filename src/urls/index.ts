
import axios from 'axios';
import { notification } from 'antd';

let headers = {
    'Content-Type': 'application/json',
};

const request = (options: any) => {
    const onSuccess = (res: any) => res;
    const onError = (err: any) => {
        notification.error({
            message: 'Error',
            description: String(err),
            placement: 'bottomLeft',
            duration: 5,
        });
    }

    if (options.headers) {
        headers = options.headers
    }

    const client = axios.create({
        headers
    });

    return client(options)
        .then(onSuccess)
        .catch(onError);
}


export default request


export const AccountUrls = {
    postAuthToken: 'https://auth-api.vndirect.com.vn/v3/auth',
    fetchAccount: 'https://trade-api.vndirect.com.vn/accounts/0001069456',
    fetchAccountPortfolio: 'https://trade-api.vndirect.com.vn/accounts/v3/0001069456/portfolio',
    fetchAccountAssets: 'https://trade-api.vndirect.com.vn/accounts/v2/0001069456/assets',
    fetchAccountStocks: 'https://trade-api.vndirect.com.vn/accounts/v3/0001069456/stocks',
    fetchOrdersHistory: (fromDate: string, toDate: string) => `https://trade-report-api.vndirect.com.vn/accounts/0001069456/orders_history/?fromDate=${fromDate}&toDate=${toDate}&pageSize=1000`,
    fetchCashStatement: (index: number) => `https://trade-report-api.vndirect.com.vn/accounts/0001069456/cashStatement?fromDate=2017-01-01&index=${index}&offset=50&types=`
}
