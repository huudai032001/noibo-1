import type { PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "none",
        "title": "Thông tin chung",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "co_phan",
        "title": "Cổ phần (1)",
        "prefix": "%%"
    },
    {
        "key": "chi_tieu_doanh_so",
        "title": "Chỉ tiêu doanh số (2)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Kết quả đạt được trong tháng",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "doanh_so_khu_vuc",
        "title": "Doanh số khu vực (3)",
        "prefix": "currency"
    },
    {
        "key": "doanh_so_ca_nhan",
        "title": "Doanh số cá nhân (3.1)",
        "tooltip": "Đã nằm trong mục (3)",
        "prefix": "currency"
    },
    {
        "key": "ds_digital_khu_vuc",
        "title": "Doanh số Digital khu vực",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "key": "kpi_doanh_so",
        "title": "KPI Doanh số (4) = (3) / (2) * 100%",
        "prefix": "%%"
    },
    {
        "key": "none",
        "title": "Các chỉ số kinh doanh",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "loi_nhuan_kinh_doanh",
        "title": "Lợi nhuận kinh doanh (5)",
        "tooltip": "(24) = (5) - (21)",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_loi_nhuan_chia_trong_thang",
        "title": "50% lợi nhuận chia trong tháng (6)",
        "tooltip": "(25) = (24) * 50%",
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
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "phan_tram_thuong_ds_digital_khu_vuc",
        "title": "% Thưởng doanh số Digital khu vực",
        "prefix": "currency"
    },
    {
        "key": "thuong_ds_digital_khu_vuc",
        "title": "Thưởng doanh số Digital khu vực",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_thuong_kpi",
        "title": "% Thưởng KPI (7)",
        "tooltip": "- Nếu (4) >= 100%, thưởng % KPIs theo bậc\n- Nếu (4) từ 70-100%, nhận 50% thưởng KPIs\n- Nếu (4) < 70%, không nhận thưởng",
        "prefix": "%%"
    },
    {
        "key": "thuong_kpi",
        "title": "Thưởng KPI (8.1)",
        "tooltip": "- Nếu (4) >= 100%, thưởng % KPIs theo bậc\n- Nếu (4) từ 70-100%, nhận 50% thưởng KPIs\n- Nếu (4) < 70%, không nhận thưởng",
        "prefix": "currency"
    },
    {
        "key": "thuong_ds_ca_nhan",
        "title": "Thưởng DS cá nhân (8.2)",
        "prefix": "currency"
    },
    {
        "key": "loi_tuc",
        "title": "Lợi tức (9) = (1) * (6)",
        "prefix": "currency"
    },
    {
        "key": "thuong_khac",
        "title": "Thưởng khác (10)",
        "prefix": "currency"
    },
    {
        "key": "phu_cap",
        "title": "Phụ cấp (11)",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước (12)",
        "prefix": "currency"
    },
    {
        "key": "thuong_kpi_loi_tuc",
        "title": "Thưởng DS cá nhân + Thưởng KPI + Lợi tức (13) = (8.1) + (8.2) + (9)",
        "prefix": "currency"
    },
    {
        "key": "thuong_kpi_loi_tuc_thuc_tra",
        "title": "Thưởng DS cá nhân + Thưởng KPI + Lợi tức thực trả (14)",
        "tooltip": "- Nếu (13) >= 10.000.000 VNĐ thì (14) = (13)\n- Nếu (13) < 10.000.000 VNĐ thì (14) = 10.000.000 VNĐ",
        "prefix": "currency"
    },
    {
        "key": "tong_cac_khoan_thu_nhap_gdkv",
        "title": "Tổng các khoản thu nhập GĐKV (15) = (14) + (10) + (11) + (12)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Thu nhập RSM",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "thu_nhap_rsm",
        "title": "Thu nhập RSM (16)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản trừ",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "trich_dong_bhxh",
        "title": "Trích đóng BHXH (17)",
        "tooltip": "Áp dụng với GĐVP từ 23 tuổi trở lên",
        "prefix": "currency"
    },
    {
        "key": "cong_no",
        "title": "Công nợ (18)",
        "prefix": "currency"
    },
    {
        "key": "von_gop",
        "title": "Vốn góp (19)",
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
        "title": "Thuế thu nhập cá nhân (22)",
        "prefix": "currency",
        "tooltip": "- Nhân sự ký hợp đồng hợp tác, hợp đồng dịch vụ: Thuế thu nhập cá nhân = 10% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\nThử việc: Thuế thu nhập cá nhân = 10% * 85% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\n- Nhân sự ký hợp đồng lao động: Thuế thu nhập cá nhân tính theo phương pháp luỹ tiến"
    },
    {
        "key": "tong_cac_khoan_tru_thu_nhap",
        "title": "Tổng các khoản trừ thu nhập (Không bao gồm Thuế TNCN) (23) = (17) + (18) + (19) + (20) + (21) + (22)",
        "prefix": "currency"
    },
    {
        "key": "thu_viec",
        "title": "Thử việc"
    },
    {
        "key": "ghi_chu",
        "title": "Ghi chú"
    },
    {
        "key": "thu_nhap_thuc_nhan",
        "title": "Thu nhập thực nhận (24) = (15) + (16) - (23) - (22)",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5",
        "prefix": "currency"
    }
]
