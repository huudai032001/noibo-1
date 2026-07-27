import type { PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "none",
        "title": "Thu nhập GĐKV",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "doanh_so_khu_vuc",
        "title": "Doanh thu đội kinh doanh (1)",
        "prefix": "currency"
    },
    {
        "key": "loi_nhuan_kinh_doanh_khu_vuc",
        "title": "Lợi nhuận kinh doanh (2)",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_co_phan",
        "title": "% Cổ phần (3)",
        "prefix": "%"
    },
    {
        "key": "thu_nhap_co_tuc",
        "title": "Thu nhập cổ tức (4) = 50% * (2) * (3)",
        "prefix": "currency"
    },
    {
        "key": "kpi",
        "title": "% KPI (5)",
        "prefix": "%"
    },
    {
        "key": "thuong_kpi",
        "title": "Thu nhập KPI (6) = 0,5% * (1) * (5)",
        "bold": true,
        "prefix": "currency"
    },
    {
        "key": "loi_nhuan_van_phong_con_lai",
        "title": "Lợi nhuận văn phòng còn lại (7) = 50% * (2 )",
        "prefix": "currency",
        "tooltip": "50% lợi nhuận trong mỗi tháng còn lại sẽ được chia vào tháng 1 của năm kế tiếp"
    },
    {
        "key": "ttt_co_tuc_thu_nhap_kpi",
        "title": "Tổng thu nhập cổ tức, thu nhập KPI (8) = (4) + (6)",
        "prefix": "currency"
    },
    {
        "key": "ttt_co_tuc_thu_nhap_kpi_thuc_nhan",
        "title": "Tổng thu nhập cổ tức, thu nhập KPI thực nhận (9)",
        "prefix": "currency",
        "tooltip": "Trong trường hợp Tổng thu nhập cổ tức, thu nhập KPI dưới 10.000.000 VNĐ, thì tổng thu nhập thực nhận phần này là 10.000.000 VNĐ"
    },
    {
        "key": "tien_phu_cap",
        "title": "Phụ cấp (10)",
        "prefix": "currency"
    },
    {
        "key": "thuong",
        "title": "Thưởng (11)",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước (12)",
        "prefix": "currency"
    },
    {
        "key": "tong_thu_nhap_gdkv",
        "title": "Tổng thu nhập GĐKV (13) = (9) + (10) + (11) + (12)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Thu nhập kiêm nhiệm RSM",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "doanh_thu_khu_vuc",
        "title": "Doanh số vùng (14)",
        "prefix": "currency"
    },
    {
        "key": "loi_nhuan_kinh_doanh",
        "title": "Lợi nhuận kinh doanh (15)",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_co_phan_rsm",
        "title": "% Cổ phần RSM (16)",
        "prefix": "%"
    },
    {
        "key": "loi_nhuan_van_phong_con_lai_vung",
        "title": "Lợi nhuận văn phòng còn lại (17) = 50% * (15)",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_rsm",
        "title": "Thu nhập RSM (18) = 50% * (15) * (16)",
        "prefix": "currency",
        "tooltip": "Trong trường hợp Tổng TN GĐKV và RSM nhỏ hơn 10.000.000 VNĐ thì Thu nhập kiêm nhiệm RSM bằng 0"
    },
    {
        "key": "none",
        "title": "Các khoản trừ thu nhập",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "gop_von",
        "title": "Góp vốn (19)",
        "prefix": "currency"
    },
    {
        "key": "cong_no",
        "title": "Công nợ (20)",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt (21)",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác (22)",
        "prefix": "currency"
    },
    {
        "key": "tong_khoan_tru_thu_nhap",
        "title": "Tổng các khoản trừ thu nhập (23) = (19) + (20) + (21) + (22)",
        "prefix": "currency"
    },
    {
        "key": "salary",
        "title": "Thu nhập thực nhận (24) = (13) + (18) - (23)",
        "prefix": "currency",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    }
]
