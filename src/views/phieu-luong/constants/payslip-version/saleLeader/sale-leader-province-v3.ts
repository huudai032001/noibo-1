import type { PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "none",
        "title": "Thông tin chung",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "title": "Lương cơ bản (1)",
        "key": "luong_co_ban",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Chỉ tiêu doanh số đội (2)",
        "key": "chi_tieu_doanh_so_doi",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Chỉ tiêu công đi làm (3)",
        "key": "chi_tieu_cong_di_lam",
        "tooltip": ""
    },
    {
        "title": "Chỉ tiêu tỉ lệ tư vấn thành công (4)",
        "key": "chi_tieu_ti_le_tu_van_thanh_cong",
        "tooltip": ""
    },
    {
        "key": "none",
        "title": "Kết quả đạt được trong tháng",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "title": "Doanh số tư vấn (5)",
        "key": "doanh_so_tu_van",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Doanh số đội (6)",
        "key": "doanh_so_doi",
        "tooltip": "Chiếm tỉ trọng 20% KPI",
        "prefix": "currency"
    },
    {
        "title": "Doanh số cá nhân (7)",
        "key": "doanh_so_ca_nhan",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Doanh số Digital",
        "key": "doanh_so_digital",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Công đi làm (8)",
        "key": "cong_di_lam",
        "tooltip": "Chiếm tỉ trọng 50% KPI"
    },
    {
        "title": "Tỉ lệ tư vấn thành công của cá nhân SL (9)",
        "key": "ti_le_tu_van_thanh_cong",
        "tooltip": "Chiếm tỉ trọng 30% KPI",
        "prefix": "%%"
    },
    {
        "title": "KPI Doanh số đội (10)",
        "key": "kpi_doanh_so_doi",
        "tooltip": "(10) = (6) / (2)\nTối đa đạt 100%",
        "prefix": "%%"
    },
    {
        "title": "KPI Công đi làm (11)",
        "key": "kpi_cong_di_lam",
        "tooltip": "(11) = (8) / (3)\nTối đa đạt 100%",
        "prefix": "%%"
    },
    {
        "title": "KPI Tỉ lệ tư vấn (12)",
        "key": "kpi_ti_le_tu_van",
        "tooltip": "(12) = (9) / (4)\nTối đa đạt 100%",
        "prefix": "%%"
    },
    {
        "title": "Tổng KPI đạt (13)",
        "key": "tong_kpi_dat",
        "tooltip": "(13) = 20% * (10) + 50% * (11) + 30% * (12)",
        "prefix": "%%"
    },
    {
        "key": "thuong_trai_phieu_tich_luy",
        "title": "Giá trị trái phiếu tích lũy",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản thu nhập",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "title": "Thu nhập theo lương cứng (14)",
        "key": "thu_nhap_theo_luong_cung",
        "tooltip": "(14) = (1) * (13)",
        "prefix": "currency"
    },
    {
        "title": "% Thưởng DS cá nhân (15)",
        "key": "phan_tram_thuong_ds_ca_nhan",
        "tooltip": "Nếu (7) dưới 40.000.000 VNĐ thì (15) = 6%",
        "prefix": "%%"
    },
    {
        "title": "Thưởng DS cá nhân (16)",
        "key": "thuong_ds_ca_nhan",
        "tooltip": "(16) = (15) * (7)",
        "prefix": "currency"
    },
    {
        "title": "% Thưởng tư vấn (17)",
        "key": "phan_tram_thuong_tu_van",
        "tooltip": "",
        "prefix": "%%"
    },
    {
        "title": "Thưởng tư vấn (18)",
        "key": "thuong_tu_van",
        "tooltip": "(18) = (17) * (5)",
        "prefix": "currency"
    },
    {
        "title": "% Thưởng DS đội (19)",
        "key": "phan_tram_thuong_ds_doi",
        "tooltip": "Đạt chỉ tiêu: Thưởng % KPIs theo bậc\nĐạt từ 70-100% chỉ tiêu: Nhận 50% thưởng KPIs\nĐạt dưới 70% chỉ tiêu: Không nhận thưởng",
        "prefix": "%%"
    },
    {
        "title": "Thưởng DS đội (20)",
        "key": "thuong_ds_doi",
        "tooltip": "(20) = (19) * (6)",
        "prefix": "currency"
    },
    {
        "title": "% Thưởng doanh số digital",
        "key": "phan_tram_thuong_ds_digital",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Thưởng doanh số digital",
        "key": "thuong_ds_digital",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Thưởng đào tạo (21)",
        "key": "thuong_dao_tao",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Thưởng phỏng vấn (22)",
        "key": "thuong_phong_van",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Thưởng khác (23)",
        "key": "thuong_khac",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Phụ cấp (24)",
        "key": "phu_cap",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Thu nhập thiếu tháng trước (25)",
        "key": "thu_nhap_thieu_thang_truoc",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Tổng các khoản thu nhập (26)",
        "key": "tong_cac_khoan_thu_nhap",
        "tooltip": "(24) = (14) + (16) + (18) + (20) + (21) + (22) + (23) + (24) + (25)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản trừ",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "title": "Trích đóng BHXH (27)",
        "key": "trich_dong_bhxh",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Phạt (28)",
        "key": "phat",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Trừ khác (29)",
        "key": "tru_khac",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "key": "thue_tncn",
        "title": "Thuế thu nhập cá nhân (30)",
        "prefix": "currency",
        "tooltip": "- Nhân sự ký hợp đồng hợp tác, hợp đồng dịch vụ: Thuế thu nhập cá nhân = 10% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\nThử việc: Thuế thu nhập cá nhân = 10% * 85% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\n- Nhân sự ký hợp đồng lao động: Thuế thu nhập cá nhân tính theo phương pháp luỹ tiến"
    },
    {
        "title": "Tổng các khoản trừ thu nhập (Không bao gồm Thuế TNCN) (31) = (27) + (28) + (29)",
        "key": "tong_cac_khoan_tru_thu_nhap",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Thử việc ",
        "key": "thu_viec",
        "tooltip": ""
    },
    {
        "title": "Ghi chú ",
        "key": "ghi_chu",
        "tooltip": ""
    },
    {
        "title": "Thu nhập thực nhận (32) = (26) - (31) - (30)",
        "key": "thu_nhap_thuc_nhan",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5",
        "prefix": "currency"
    }
]
