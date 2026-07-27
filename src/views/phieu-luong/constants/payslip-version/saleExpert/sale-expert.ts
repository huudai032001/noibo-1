import type { PayslipData, PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "revenue_personal",
        "title": "Doanh số cá nhân",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "revenue_sale_expert",
        "title": "Doanh số đội SE",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_kinh_doanh",
        "title": "Thu nhập kinh doanh",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "so_hop_dong",
        "title": "Số hợp đồng TVV",
        "bold": true
    },
    {
        "key": "thu_nhap_tvv",
        "title": "Thu nhập TVV",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_truong_phong",
        "title": "Thu nhập phỏng vấn, đào tạo, lead ca làm việc",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        key: (row: PayslipData) => (row.salary as number) + (row.thuong as number) - (row.phat as number),
        title: 'Thu nhập',
        logsArray: true,
        prefix: 'currency',
    },
    {
        "key": "thuong",
        "title": "Thưởng",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "the_ten",
        "title": "Thẻ tên",
        "prefix": "currency"
    },
    {
        "key": "mba",
        "title": "MBA",
        "prefix": "currency"
    },
    {
        "key": "ao_tvv",
        "title": "Áo TVV",
        "prefix": "currency"
    },
    {
        "key": "tong_thu_nhap",
        "title": "Tổng thu nhập",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác",
        "prefix": "currency"
    },
    {
        "key": "salary",
        "title": "Lương thực nhận",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency",
        "className": "total-get"
    }
]
