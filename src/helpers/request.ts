
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
