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
        "note": "% thử việc nhận theo hợp đồng thử việc"
    },
    {
        "key": "thu_nhap_kra",
        "title": "Thu nhập KRA (11) = [(8) * x% + (9) * y%] * (1)",
        "prefix": "currency",
        "note": "x% là tỷ trọng thời gian\ny% là tỷ trọng KPI công việc"
    },
    {
        "key": "none",
        "title": "Các khoản thu nhập khác",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "phu_cap_mien_thue",
        "title": "Phụ cấp miễn thuế (12) (Ăn ca, di chuyển, điện thoại)",
        "prefix": "currency"
    },
    {
        "key": "phu_cap_khac",
        "title": "Phụ cấp khác (13) (Chịu thuế)",
        "prefix": "currency"
    },
    {
        "key": "tang_ca",
        "title": "Tăng ca (14)",
        "prefix": "currency"
    },
    {
        "key": "thuong",
        "title": "Thưởng (15)",
        "tooltip": "Thưởng doanh số, thưởng công việc",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thiếu tháng trước (16)",
        "prefix": "currency"
    },
    {
        "key": "tong_cac_khoan_thu_nhap_khac",
        "title": "Tổng các khoản thu nhập khác (17) = (12) + (13) + (14) + (15) + (16)",
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
        "title": "Trích đóng bảo hiểm (18)",
        "prefix": "currency",
        "note": "Mức lương tham gia BHXH * 10.5%"
    },
    {
        "key": "tam_ung",
        "title": "Tạm ứng (19)",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt (20)",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác (21)",
        "prefix": "currency"
    },
    {
        "key": "thue_tncn",
        "title": "Thuế TNCN (22)",
        "prefix": "currency",
        "note": "Thu nhập chịu thuế 2025 (fulltime chính thức) = {[(11) + (13) + (14) + (15) + (16) - (19) - (20) - (21)] * Z% - (18) * (27) * 6.2tr - 15.5tr} * % thuế lũy tiến\n(Z% là % công ty hỗ trợ khai thu nhập chịu thuế)"
    },
    {
        "key": "tong_cac_khoan_tru_thu_nhap",
        "title": "Tổng các khoản trừ thu nhập (23) = (18) + (19) + (20) + (21) + (22)",
        "prefix": "currency"
    },
    {
        "key": "luong_thuc_nhan",
        "title": "TỔNG THU NHẬP THỰC NHẬN = (11) + (17) - (23)",
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
        "key": "gia_tri_trai_phieu_tich_luy",
        "title": "Giá trị trái phiếu tích lũy"
    },
    {
        "key": "diem_tich_luy_quy",
        "title": "Điểm tích lũy quý"
    },
    {
        "key": "so_nguoi_phu_thuoc",
        "title": "Số người phụ thuộc",
        "prefix": "currency",
        "note": "Giảm trừ 6.200.000đ/ Người phụ thuộc trên tổng thu nhập chịu thuế"
    },
    {
        "key": "ghi_chu",
        "title": "Ghi chú"
    }
]
