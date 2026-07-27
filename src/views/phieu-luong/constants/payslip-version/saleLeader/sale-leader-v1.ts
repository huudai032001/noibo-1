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
        "key": "none",
        "title": "Các khoản thu nhập",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "thu_nhap_kinh_doanh",
        "title": "Thu nhập kinh doanh (1)",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_tvv",
        "title": "Thu nhập TVV (2)",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_phong_van",
        "title": "Thu nhập phỏng vấn (3)",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_dao_tao",
        "title": "Thu nhập đào tạo (4)",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_lead_ca_lam_viec",
        "title": "Thu nhập lead ca làm việc (5)",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "thuong",
        "title": "Thưởng (6)",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước (7)",
        "prefix": "currency"
    },
    {
        "key": "tong_khoan_thu_nhap",
        "title": "Tổng các khoản thu nhập (8) = (1) + (2) + (3) + (4) + (5) + (6) + (7)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản trừ thu nhập",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "che_tai_tvv",
        "title": "Chế tài TVV (9)",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt (10)",
        "prefix": "currency",
        "extraTime": true,
        "logsArray": true
    },
    {
        "key": "the_ten",
        "title": "Thẻ tên (11)",
        "prefix": "currency"
    },
    {
        "key": "mba",
        "title": "MBA (12)",
        "prefix": "currency"
    },
    {
        "key": "ao_tvv",
        "title": "Áo TVV (13)",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác (14)",
        "prefix": "currency"
    },
    {
        "key": "tong_khoan_tru_thu_nhap",
        "title": "Tổng các khoản trừ thu nhập (15) = (9) + (10) + (11) + (12) + (13) + (14)",
        "prefix": "currency"
    },
    {
        "key": "salary",
        "title": "Thu nhập thực nhận (16) = (8) - (15)",
        "extraTime": true,
        "logsArray": true,
        "prefix": "currency",
        "className": "total-get",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    }
]
