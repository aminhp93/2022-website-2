import { notification, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { getColumnsFromListData } from 'utils';


export default function Test() {
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0)

    const columns = getColumnsFromListData(list)

    const fetch = async () => {
        try {
            const res = await axios({
                method: "GET",
                url: 'http://localhost:3001/grab/',
                params: {
                    cuisineId: null,
                    page: 1,
                    cateId: 12
                }
            })
            console.log(res)
            setList(JSON.parse(res.data.message).Items.map(i => {
                ['LstCategory',
                    'LstCuisine',
                    'PriceMin',
                    'PriceMax',
                    'PriceMinDisplay',
                    'PriceMaxDisplay',
                    'DisplayOrder',
                    'City',
                    'District',
                    'ContributeStatus',
                    'CanDelete',
                    'ListOwnerId',
                    'ListId',
                    'UserId',
                    'IsRestaurantCollection',
                    'HasVideo',
                    'PromotionId',
                    'PromotionTitle',
                    'PromotionUrl',
                    'Floor',
                    'IsSaved',
                    'PromotionPlainTitle',
                    'DistanceText',
                    'MobileBookingUrl',
                    'LocationUrlRewriteName',
                    'RestaurantId',
                    'MainCategoryId',
                    'MobileBgColor',
                    'LstPicture',
                    'ResUsername',
                    'Latitude',
                    'Longitude',
                    'MemberCardDiscount',
                    'HasPromotion',
                    'HasMemberCard',
                    'Tags',
                    'Description',
                    'Note',
                    'Id'
                ].map(item => delete i[item])


                return i
            }))
            setTotal(JSON.parse(res.data.message).Total)
        } catch (e) {
            notification.error({ message: "Error" })
        }

    }

    useEffect(() => {
        fetch()
    }, [])

    return <div>Test
        <div>Total: {total}</div>
        <div>
            <div style={{ overflow: "auto" }}>
                <Table size={'small'} dataSource={list} columns={columns} pagination={false} />
            </div>
        </div>
    </div >
}
