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
        "key": "cong_thang",
        "title": "Công đi làm thực tế (2)"
    },
    {
        "key": "phep_nam",
        "title": "Ngày phép (3)"
    },
    {
        "key": "ngay_le_tet_viec_rieng",
        "title": "Lễ, Tết, Việc riêng (4)"
    },
    {
        "key": "so_ngay_di_muon",
        "title": "Số ngày đi muộn (5)"
    },
    {
        "key": "tong_cong_thang",
        "title": "Tổng công tháng (6) = (2) + (3) + (4) - (5)"
    },
    {
        "key": "cong_dinh_muc",
        "title": "Công định mức (7)"
    },
    {
        "key": "phan_tram_kpi_thoi_gian",
        "title": "% KPI thời gian (8) = (6) / (7)",
        "prefix": "%%"
    },
    {
        "key": "phan_tram_kpi_hoan_thanh_cong_viec",
        "title": "% KPI công việc (9)",
        "prefix": "%%"
    },
    {
        "key": "thu_viec",
        "title": "Thử việc (10)",
        "tooltip": "Nếu thử việc, nhận 85% thu nhập KRA"
    },
    {
        "key": "thu_nhap_kra",
        "title": "Thu nhập KRA (11) = [(8) * x% + (9) * y%] * (1)",
        "tooltip": "x: Tỉ trọng % KPI thời gian trong HĐLĐ \ny: Tỉ trọng % KPI công việc trong HĐLĐ",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản thu nhập chịu thuế",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "tang_ca",
        "title": "Tăng ca chịu thuế (12)",
        "prefix": "currency"
    },
    {
        "key": "phu_cap",
        "title": "Phụ cấp công việc (13)",
        "prefix": "currency"
    },
    {
        "key": "thuong",
        "title": "Thưởng (14)",
        "tooltip": "Thưởng doanh số, thưởng công việc",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước (15)",
        "prefix": "currency"
    },
    {
        "key": "tong_cac_khoan_thu_nhap",
        "title": "Tổng các khoản thu nhập chịu thuế (16) = [(11) + (12) + (13) + (14) + (15)] * X%",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản thu nhập miễn thuế",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "tang_ca_mien_thue",
        "title": "Tăng ca miễn thuế (17)",
        "prefix": "currency"
    },
    {
        "key": "phu_cap_khac",
        "title": "Phụ cấp (Ăn trưa, điện thoại, di chuyển...) (18)",
        "prefix": "currency"
    },
    {
        "key": "tong_thu_nhap_mien_thue",
        "title": "Tổng các khoản thu nhập miễn thuế",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản trừ thu nhập",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "bhxh_thang",
        "title": "Đóng bảo hiểm (20)",
        "prefix": "currency"
    },
    {
        "key": "tam_ung",
        "title": "Tạm ứng (21)",
        "prefix": "currency"
    },
    {
        "key": "khong_du_cong",
        "title": "Phạt thiếu công (22)",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt khác (23)",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác (24)",
        "prefix": "currency"
    },
    {
        "key": "tong_cac_khoan_tru_thu_nhap",
        "title": "Tổng các khoản trừ thu nhập (25) = (20) + (21) + (22) + (23) + (24)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Thuế TNCN",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "giam_tru_nguoi_phu_thuoc",
        "title": "(26) Giảm trừ người phụ thuộc",
        "prefix": "currency"
    },
    {
        "key": "thue_tncn",
        "title": "(27) Thuế TNCN",
        "prefix": "currency"
    },
    {
        "key": "luong_thuc_nhan",
        "title": "Thu nhập thực nhận (28) = (16) + (19) - (25) - (27)",
        "prefix": "currency",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "none",
        "title": "Khác",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "so_exp_tich_luy",
        "title": "Số EXP tích lũy"
    },
    {
        "key": "so_ngay_phep_con_lai",
        "title": "Số ngày phép chưa dùng"
    },
    {
        "key": "thuong_trai_phieu_tich_luy",
        "title": "Giá trị trái phiếu tích lũy",
        "prefix": "currency"
    },
    {
        "key": "diem_tich_luy_quy",
        "title": "Điểm tích lũy quý"
    },
    {
        "key": "ghi_chu",
        "title": "Ghi chú"
    }
]
