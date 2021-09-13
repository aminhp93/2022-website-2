import ReactMarkdown from "react-markdown"

export default function InvestmentStrategy() {
    return <div>
        <div>InvestmentStrategy</div>
        <div>
            <ReactMarkdown>
                {`
                    \n # Tai san gia tri < 3 ty
                    \n ## Expect:
                    \n - Gia tri tai san tang nhanh: 5->10%/thang
                    \n - Thoi gian giu: <2 tuan, neu sai qua 5-7% cat lo
                    \n - Thanh khoan: > 5 ty/phien
                    \n - Kieu mua ban: ban het 100% co phieu trong 1 phien

                    \n # Tai san gia tri > 3 ty & < 10 ty
                    \n ## Expect:
                    \n - Gia tri tai san tang cham: 10%/3-6 thang
                    \n - Danh muc: lua chon danh muc ky luong vs muc rui ro thap
                    \n - Thanh khoan: 10-20 ty/phien
                    \n - Kieu mua ban: ban het 100% co phieu trong nhieu phien
                    
                    \n # Tai san gia tri > 10 ty
                    \n ## Expect:
                    \n - Gia tri tai san thang ham: 10%/1-2 nam
                    \n - Danh muc: lua chon danh muc ky luong vs muc rui ro rat thap
                    \n - Kieu mua ban: ban 1 phan de quan ly va co cau danh muc --> can tim hieu ky hon

                `}
            </ReactMarkdown>

        </div>
    </div>
}
