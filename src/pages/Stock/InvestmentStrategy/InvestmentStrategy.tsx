import ReactMarkdown from "react-markdown"

export default function InvestmentStrategy() {
    return <div>
        <div>InvestmentStrategy</div>
        <div>
            <ReactMarkdown>
                {`
                    \n# Tai san gia tri < 1 ty
                    \n## Expect:
                    \n - Gia tri tai san tang nhanh: 5->10%/thang
                    \n - Thoi gian giu: <2 tuan, neu sai qua 5-7% cat lo

                    \n# Tai san gia tri > 1 ty
                    \n## Expect:
                    \n - Gia tri tai san tang cham: 10%/3-6 thang
                    \n - Danh muc: lua chon danh muc ky luong vs muc rui ro thap


                `}
            </ReactMarkdown>

        </div>
    </div>
}
