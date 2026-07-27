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
        "key": "attendance",
        "title": "Số công tháng",
        "extraTime": true,
        "logsArray": true
    },
    {
        key: (row: PayslipData) => (row.salary as number) + (row.thuong as number) - (row.phat as number),
        title: 'Thu nhập (thử việc)',
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
        "key": "the_ten",
        "title": "Thẻ tên",
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
