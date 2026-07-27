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
        "title": "Chỉ tiêu doanh số cá nhân (1)",
        "key": "chi_tieu_doanh_so_ca_nhan",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "% thưởng không đạt chỉ tiêu (2)",
        "key": "phan_tram_thuong_khong_dat_chi_tieu",
        "tooltip": "",
        "prefix": "%%"
    },
    {
        "title": "% thưởng đạt chỉ tiêu (3)",
        "key": "phan_tram_thuong_dat_chi_tieu",
        "tooltip": "",
        "prefix": "%%"
    },
    {
        "key": "none",
        "title": "Kết quả đạt được trong tháng",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "title": "Doanh số tư vấn (4)",
        "key": "doanh_so_tu_van",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Doanh số đội (5)",
        "key": "doanh_so_doi",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Doanh số cá nhân (6)",
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
        "title": "% Thưởng Doanh số (7)",
        "key": "phan_tram_thuong_doanh_so",
        "tooltip": "",
        "prefix": "%%"
    },
    {
        "title": "Thưởng doanh số (8) = (6) * (7)",
        "key": "thuong_doanh_so",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "% Thưởng tư vấn (9)",
        "key": "phan_tram_thuong_tu_van",
        "tooltip": "Áp dụng từ Sales Executive trở lên",
        "prefix": "%%"
    },
    {
        "title": "Thưởng tư vấn (10) = (4) * (9)",
        "key": "thuong_tu_van",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "% Thưởng hỗ trợ đội (11)",
        "key": "phan_tram_thuong_ho_tro_doi",
        "tooltip": "Áp dụng từ Sales Pro trở lên",
        "prefix": "%%"
    },
    {
        "title": "Thưởng hỗ trợ đội (12) = (5) * (11)",
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
        "title": "Thưởng khác (13)",
        "key": "thuong_khac",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Phụ cấp (14)",
        "key": "phu_cap",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Thu nhập thiếu tháng trước (15)",
        "key": "thu_nhap_thieu_thang_truoc",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Tổng các khoản thu nhập (16) = (8) + (9) + (12) + (13) + (14) + (15)",
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
        "title": "Trích đóng BHXH (17)",
        "key": "trich_dong_bhxh",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Phạt (18)",
        "key": "phat",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "title": "Trừ khác (19)",
        "key": "tru_khac",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "key": "thue_tncn",
        "title": "Thuế thu nhập cá nhân (20)",
        "prefix": "currency",
        "tooltip": "- Nhân sự ký hợp đồng hợp tác, hợp đồng dịch vụ: Thuế thu nhập cá nhân = 10% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\nThử việc: Thuế thu nhập cá nhân = 10% * 85% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\n- Nhân sự ký hợp đồng lao động: Thuế thu nhập cá nhân tính theo phương pháp luỹ tiến"
    },
    {
        "title": "Tổng các khoản trừ thu nhập (Không bao gồm Thuế TNCN) (21) = (17) + (18) + (19)",
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
        "title": "Thu nhập thực nhận (24) = (16) - (21) - (20)",
        "key": "thu_nhap_thuc_nhan",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5",
        "prefix": "currency"
    }
]
