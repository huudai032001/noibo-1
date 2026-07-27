import type { PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "none",
        "title": "Thông tin chung",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "doanh_thu_doi_kd",
        "title": "Doanh thu đội KD (1)",
        "prefix": "currency"
    },
    {
        "key": "luong_doi_kd",
        "title": "Lương đội kinh doanh (2)",
        "prefix": "currency"
    },
    {
        "key": "chi_phi_sp",
        "title": "Chi phí sản phẩm (3)",
        "prefix": "currency"
    },
    {
        "key": "phi_backoffice",
        "title": "Phí tổng, backoffice 12,5% (4)",
        "bold": true,
        "prefix": "currency"
    },
    {
        "key": "doanh_so_tai_diem",
        "title": "Doanh số tại điểm (5)",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_chi_sp_tai_diem",
        "title": "% Chi phí tại điểm (6)",
        "prefix": "%"
    },
    {
        "key": "chi_nha",
        "title": "Chi nhà (7)",
        "prefix": "currency"
    },
    {
        "key": "chi_khau_hao",
        "title": "Chi khấu hao (8)",
        "prefix": "currency"
    },
    {
        "key": "chi_van_phong",
        "title": "Chi văn phòng (9)",
        "prefix": "currency"
    },
    {
        "key": "chi_luong_hckv",
        "title": "Chi lương HCKV (10)",
        "prefix": "currency"
    },
    {
        "key": "thuong_team_lead",
        "title": "Thưởng Teamlead (11)",
        "prefix": "currency"
    },
    {
        "key": "loi_nhuan_kd_tai_diem",
        "title": "Lợi nhuận kinh doanh tại điểm (12)",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_co_phan",
        "title": "% Cổ phần (13)",
        "prefix": "%"
    },
    {
        "key": "none",
        "title": "Các khoản thu nhập ",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "thu_nhap_co_tuc",
        "title": "Thu nhập cổ tức (14) = 50% * (12) * (13)",
        "prefix": "currency"
    },
    {
        "key": "wow_1",
        "title": "Số WOW (15)"
    },
    {
        "key": "wow_2",
        "title": "Điểm WOW (16) = (15) / 100"
    },
    {
        "key": "thu_nhap_wow",
        "title": "Thu nhập WOW (17) = 2% * (1) * (16)",
        "prefix": "currency"
    },
    {
        "key": "ttt_co_tuc_thu_nhap_wow",
        "title": "Tổng thu nhập cổ tức, thu nhập WOW (18) = (14) + (17)",
        "prefix": "currency"
    },
    {
        "key": "loi_nhuan_giu_lai",
        "title": "Lợi nhuận văn phòng còn lại (19) = (12) * 50%",
        "prefix": "currency",
        "tooltip": "50% lợi nhuận trong mỗi tháng còn lại sẽ được chia vào tháng 1 của năm kế tiếp"
    },
    {
        "key": "ttt_co_tuc_thu_nhap_wow_thuc_nhan",
        "title": "Tổng thu nhập cổ tức, thu nhập WOW thực nhận (20)",
        "prefix": "currency",
        "tooltip": "Trong trường hợp Tổng thu nhập cổ tức, thu nhập WOW dưới 5.000.000 VNĐ, thì tổng thu nhập thực nhận phần này là 5.000.000 VNĐ"
    },
    {
        "key": "thu_nhap_phong_van",
        "title": "Thu nhập phỏng vấn (21)",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_dao_tao",
        "title": "Thu nhập đào tạo (22)",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_lead_ca_lam_viec",
        "title": "Thu nhập lead ca làm việc (23)",
        "prefix": "currency"
    },
    {
        "key": "tien_phu_cap",
        "title": "Phụ cấp (24)",
        "prefix": "currency"
    },
    {
        "key": "thuong",
        "title": "Thưởng (25)",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước (26)",
        "prefix": "currency"
    },
    {
        "key": "tong_khoan_thu_nhap",
        "title": "Tổng các khoản thu nhập (27) = (20) + (22) + (23) + (24) + (25) + (26)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản trừ thu nhập",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "gop_von",
        "title": "Góp vốn (28)",
        "prefix": "currency"
    },
    {
        "key": "cong_no",
        "title": "Công nợ (29)",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt (30)",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác (31)",
        "prefix": "currency"
    },
    {
        "key": "tong_khoan_tru_thu_nhap",
        "title": "Tổng các khoản trừ thu nhập (32) = (28) + (29) + (30) + (31)",
        "prefix": "currency"
    },
    {
        "key": "salary",
        "title": "Thu nhập thực nhận (33) = (27) - (32)",
        "prefix": "currency",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    }
]
