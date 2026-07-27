import type { PayslipRowConfig } from '../../../models/phieu-luong.model'

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
        "key": "revenue_team",
        "title": "Doanh số đội SL",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "doanh_so_slx",
        "title": "Doanh số đội SLx",
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
        "key": "kpi_mang",
        "title": "KPI trưởng phòng cơ sở",
        "prefix": "%"
    },
    {
        "key": "thu_nhap_truong_phong",
        "title": "Thu nhập phỏng vấn, đào tạo, lead ca làm việc:",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
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
        "prefix": "currency",
        "extraTime": true,
        "logsArray": true
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
