import type { PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "none",
        "title": "Thông tin chung",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "muc_luong",
        "title": "Mức lương cơ bản (1)",
        "prefix": "currency"
    },
    {
        "key": "attendance",
        "title": "Công đi làm thực tế (2)"
    },
    {
        "key": "so_nghi_phep_nam",
        "title": "Ngày phép (3)"
    },
    {
        "key": "so_nghi_phep_khac",
        "title": "Lễ, Tết, Việc riêng (4)"
    },
    {
        "key": "tong_cong_thang",
        "title": "Tổng công tháng (5) = (2) + (3) + (4)"
    },
    {
        "key": "cong_dinh_muc",
        "title": "Công định mức (6)"
    },
    {
        "key": "kpi_tg",
        "title": "% KPI thời gian (7) = (5) / (6)",
        "prefix": "%"
    },
    {
        "key": "kpi_deadline",
        "title": "% KPI công việc (8)",
        "prefix": "%"
    },
    {
        "key": "is_probationary",
        "title": "Thử việc",
        "tooltip": "Nếu thử việc, nhận 85% thu nhập KRA",
        "convertValue": "boolean"
    },
    {
        "key": "so_exp",
        "title": "Số EXP tích lũy"
    },
    {
        "key": "so_ngay_phep_chua_dung",
        "title": "Số ngày phép chưa dùng"
    },
    {
        "key": "none",
        "title": "Các khoản thu nhập",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "thu_nhap_kra",
        "title": "Thu nhập KRA (9) = [(7) * x% + (8) * y%] * (1)",
        "tooltip": "x: Tỉ trọng % KPI thời gian trong HĐLĐ \ny: Tỉ trọng % KPI công việc trong HĐLĐ",
        "prefix": "currency"
    },
    {
        "key": "tang_ca",
        "title": "Tăng ca (10)",
        "prefix": "currency"
    },
    {
        "key": "tien_phu_cap",
        "title": "Phụ cấp (11)",
        "tooltip": "Xăng xe, điện thoại,...",
        "prefix": "currency"
    },
    {
        "key": "thuong",
        "title": "Thưởng (12)",
        "tooltip": "Thưởng doanh số, thưởng công việc",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước (13)",
        "prefix": "currency"
    },
    {
        "key": "tong_khoan_thu_nhap",
        "title": "Tổng các khoản thu nhập (14) = (9) + (10) + (11) + (12) + (13)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản trừ thu nhập",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "tien_bao_hiem",
        "title": "Trừ đóng bảo hiểm (15)",
        "prefix": "currency"
    },
    {
        "key": "tam_ung",
        "title": "Tạm ứng (16)",
        "prefix": "currency"
    },
    {
        "key": "phat_cong",
        "title": "Phạt thiếu công (17)",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt khác (18)",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác (19)",
        "prefix": "currency"
    },
    {
        "key": "tong_khoan_tru_thu_nhap",
        "title": "Tổng các khoản trừ thu nhập (20) = (15) + (16) + (17) + (18) + (19)",
        "prefix": "currency"
    },
    {
        "key": "salary",
        "title": "Thu nhập thực nhận(21)=(14)-(20)",
        "prefix": "currency",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    }
]
