import type { PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "none",
        "title": "Thông tin chung",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "title": "Cơ chế lương ",
        "key": "co_che_luong",
        "tooltip": ""
    },
    {
        "title": "Lương cứng (1)",
        "key": "luong_cung",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Chỉ tiêu doanh số cá nhân (2)",
        "key": "chi_tieu_doanh_so_ca_nhan",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Chỉ tiêu công đi làm (3)",
        "key": "chi_tieu_cong_di_lam",
        "tooltip": ""
    },
    {
        "title": "Chi tiêu số khách hàng (4)",
        "key": "chi_tieu_so_khach_hang",
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
        "tooltip": "Áp dụng với Bậc Pro và Master có Doanh số đội",
        "prefix": "currency"
    },
    {
        "title": "Doanh số cá nhân (7)",
        "key": "doanh_so_ca_nhan",
        "tooltip": "Chiếm tỉ trọng 30% KPI",
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
        "tooltip": "Chiếm tỉ trọng 40% KPI"
    },
    {
        "title": "Số khách hàng (9)",
        "key": "so_khach_hang",
        "tooltip": "Chiếm tỉ trọng 30% KPI"
    },
    {
        "title": "KPI Doanh số cá nhân (10) = (7) / (2)",
        "key": "kpi_doanh_so_ca_nhan",
        "tooltip": "Tối đa đạt 100%",
        "prefix": "%%"
    },
    {
        "title": "KPI Công đi làm (11) = (8) / (3)",
        "key": "kpi_cong_di_lam",
        "tooltip": "Tối đa đạt 100%",
        "prefix": "%%"
    },
    {
        "title": "KPI Số khách hàng (12) = (9) / (4)",
        "key": "kpi_so_khach_hang",
        "tooltip": "Tối đa đạt 100%",
        "prefix": "%%"
    },
    {
        "title": "Tổng KPI đạt (13) = 30% * (10) + 40% * (11) + 30% * (12)",
        "key": "tong_kpi_dat",
        "tooltip": "",
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
        "title": "Thu nhập theo lương cứng (14) = (1) * (13)",
        "key": "thu_nhap_theo_luong_cung",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "% Thưởng vượt Doanh số (15)",
        "key": "phan_tram_thuong_vuot_doanh_so",
        "tooltip": "",
        "prefix": "%%"
    },
    {
        "title": "Thưởng doanh số (16) = (15) * [(7) - (2)]",
        "key": "thuong_doanh_so",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "% Thưởng tư vấn (17)",
        "key": "phan_tram_thuong_tu_van",
        "tooltip": "",
        "prefix": "%%"
    },
    {
        "title": "Thưởng tư vấn (18) = (17) * (5)",
        "key": "thuong_tu_van",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "% Thưởng hỗ trợ đội (19)",
        "key": "phan_tram_thuong_ho_tro_doi",
        "tooltip": "Áp dụng với Bậc Pro và Master có Doanh số đội",
        "prefix": "%%"
    },
    {
        "title": "Thưởng hỗ trợ đội (20) = (19) * (6)",
        "key": "thuong_ho_tro_doi",
        "tooltip": "",
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
        "title": "Thưởng khác (21)",
        "key": "thuong_khac",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Phụ cấp (22)",
        "key": "phu_cap",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Thu nhập thiếu tháng trước (23)",
        "key": "thu_nhap_thieu_thang_truoc",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Tổng các khoản thu nhập (24) = (14) + (16) + (18) + (20) + (21) + (22) + (23)",
        "key": "tong_cac_khoan_thu_nhap",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản trừ",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "title": "Trích đóng BHXH (26)",
        "key": "trich_dong_bhxh",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Phạt (27)",
        "key": "phat",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Trừ khác (28)",
        "key": "tru_khac",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "key": "thue_tncn",
        "title": "Thuế thu nhập cá nhân (29)",
        "prefix": "currency",
        "tooltip": "- Nhân sự ký hợp đồng hợp tác, hợp đồng dịch vụ: Thuế thu nhập cá nhân = 10% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\nThử việc: Thuế thu nhập cá nhân = 10% * 85% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\n- Nhân sự ký hợp đồng lao động: Thuế thu nhập cá nhân tính theo phương pháp luỹ tiến"
    },
    {
        "title": "Tổng các khoản trừ thu nhập (Không bao gồm Thuế TNCN) (30) = (26) + (27) + (28)",
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
        "title": "Thu nhập thực nhận (31) = (24) - (30) - (29)",
        "key": "thu_nhap_thuc_nhan",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5",
        "prefix": "currency"
    }
]
