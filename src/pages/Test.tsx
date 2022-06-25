import { notification, Table, Divider } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getColumnsFromListData } from 'utils';

export default function Test() {
  const [list, setList] = useState([]);
  const [list2, setList2] = useState([]);
  const [list3, setList3] = useState([]);
  const [list4, setList4] = useState([]);
  const [total, setTotal] = useState(0);

  const columns = getColumnsFromListData(list);

  const fetch = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url:
          'https://shopee.vn/api/v4/search/trending_search?bundle=popsearch&limit=50&offset=0',
      });
      console.log(res);
      setList(res.data.data.querys);
    } catch (e) {
      notification.error({ message: 'Error' });
    }
  };

  const fetch2 = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url:
          'https://shopee.vn/api/v4/flash_sale/flash_sale_get_items?limit=50&need_personalize=true&offset=0&sort_soldout=true&with_dp_items=true',
      });
      console.log(res);
      setList2(res.data.data.items);
    } catch (e) {
      notification.error({ message: 'Error' });
    }
  };

  const fetch3 = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url:
          '    https://shopee.vn/api/v4/search/search_hint?keyword=hoa&search_type=0&version=1',
      });
      console.log(res);
      setList3(res.data.keywords);
    } catch (e) {
      notification.error({ message: 'Error' });
    }
  };

  const fetch4 = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url:
          'https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=hoa&limit=60&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2',
      });
      console.log(res);
      setList4(res.data.items);
    } catch (e) {
      notification.error({ message: 'Error' });
    }
  };

  useEffect(() => {
    fetch();
    fetch2();
    fetch3();
    fetch4();
  }, []);

  return (
    <div>
      Test
      <div>
        {list.map((i) => {
          return (
            <div>
              {i.text} - {i.count}
            </div>
          );
        })}
      </div>
      <Divider />
      <div>
        {list2.map((i) => {
          return (
            <div>
              {i.name} - {i.voucher.discount_percentage}
            </div>
          );
        })}
      </div>
      <Divider />
      <div>
        {list3.map((i) => {
          return <div>{i.keyword} </div>;
        })}
      </div>
      <Divider />
      <div>
        {list4.map((i) => {
          return (
            <div>
              Name: {i.item_basic.name} | sold {i.item_basic.sold} | stock{' '}
              {i.item_basic.stock}
            </div>
          );
        })}
      </div>
    </div>
  );
}
