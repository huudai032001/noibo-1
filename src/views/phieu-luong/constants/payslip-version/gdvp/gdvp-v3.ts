import type { PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "none",
        "title": "Thông tin chung",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "size_van_phong",
        "title": "Size văn phòng"
    },
    {
        "key": "luong_co_ban",
        "title": "Lương cơ bản (1)",
        "prefix": "currency"
    },
    {
        "key": "co_phan",
        "title": "Cổ phần (2)",
        "bold": true,
        "prefix": "%%"
    },
    {
        "key": "none",
        "title": "Các chỉ tiêu tháng",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "chi_tieu_doanh_so",
        "title": "Chỉ tiêu doanh số (3)",
        "prefix": "currency"
    },
    {
        "key": "chi_tieu_cong_di_lam",
        "title": "Chỉ tiêu công đi làm (4)"
    },
    {
        "key": "none",
        "title": "Kết quả đạt được trong tháng",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "doanh_so_doi_van_phong",
        "title": "Doanh số đội văn phòng (5)",
        "prefix": "currency"
    },
    {
        "key": "doanh_so_ca_nhan",
        "title": "Doanh số cá nhân (5.1)",
        "prefix": "currency",
        "tooltip": "Đã nằm trong mục (5)"
    },
    {
        "key": "doanh_so_doi_gdvp",
        "title": "Doanh số đội GĐVP (5.2)",
        "prefix": "currency",
        "tooltip": "Đã nằm trong mục (5)"
    },
    {
        "key": "cong_di_lam",
        "title": "Công đi làm (6)"
    },
    {
        "key": "ds_digital_ca_nhan",
        "title": "Doanh số Digital cá nhân",
        "prefix": "currency",
        "tooltip": ""
    },
    {
        "key": "ds_digital_doi",
        "title": "Doanh số Digital đội",
        "prefix": "currency",
        "tooltip": ""
    },
    {
        "key": "kpi_doanh_so",
        "title": "KPI Doanh số (8) = (5) / (3) * 100%",
        "prefix": "%%"
    },
    {
        "key": "kpi_cong_di_lam",
        "title": "KPI Công đi làm (9) = (6) / (4) * 100%",
        "prefix": "%%"
    },
    {
        "key": "diem_wow",
        "title": "Điểm WOW (10)"
    },
    {
        "key": "kpi_luong_cung",
        "title": "KPI lương cứng (11) = (9) * 50% + (10) * 50%",
        "prefix": "%%"
    },
    {
        "key": "none",
        "title": "Các khoản chi",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "chi_luong_kinh_doanh",
        "title": "Chi lương kinh doanh (12)",
        "tooltip": "Tổng lương của nhân sự kinh doanh và Lương cứng + Thưởng của GĐVP",
        "prefix": "currency"
    },
    {
        "key": "chi_phi_san_pham",
        "title": "Chi phí sản phẩm (13)",
        "prefix": "currency"
    },
    {
        "key": "chi_nha",
        "title": "Chi nhà (14)",
        "prefix": "currency"
    },
    {
        "key": "chi_khau_hao",
        "title": "Chi khấu hao (15)",
        "prefix": "currency"
    },
    {
        "key": "chi_phi_back_office",
        "title": "Chi phí back office (16)",
        "bold": true,
        "tooltip": "12,5% doanh số",
        "prefix": "currency"
    },
    {
        "key": "chi_phuc_loi",
        "prefix": "currency",
        "title": "Chi phúc lợi (17)"
    },
    {
        "key": "chi_luong_hckv",
        "prefix": "currency",
        "title": "Chi lương HCKV (18)"
    },
    {
        "key": "chi_van_phong",
        "prefix": "currency",
        "title": "Chi văn phòng (19)"
    },
    {
        "key": "chi_khac",
        "prefix": "currency",
        "title": "Chi khác (20)"
    },
    {
        "key": "tong_cac_khoan_chi",
        "prefix": "currency",
        "title": "Tổng các khoản chi (21)"
    },
    {
        "key": "none",
        "title": "Các chỉ số kinh doanh",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "doanh_so_tai_diem",
        "prefix": "currency",
        "title": "Doanh số tại điểm (22)"
    },
    {
        "key": "phan_tram_chi_san_pham",
        "title": "% chi sản phẩm (23)",
        "prefix": "%%"
    },
    {
        "key": "loi_nhuan_kinh_doanh",
        "title": "Lợi nhuận kinh doanh (24) = (5) - (21)",
        "prefix": "currency",
        "tooltip": "(24) = (5) - (21)"
    },
    {
        "key": "50_phan_tram_loi_nhuan_chia_trong_thang",
        "title": "50% lợi nhuận chia trong tháng (25) = (24) * 50%",
        "prefix": "currency",
        "tooltip": "(25) = (24) * 50%"
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
        "key": "thu_nhap_theo_luong_cung",
        "prefix": "currency",
        "title": "Thu nhập theo lương cứng (26)",
        "tooltip": "(26) = (1) * (11)"
    },
    {
        "key": "phan_tram_thuong_kpi",
        "title": "% Thưởng KPI (27)",
        "tooltip": "Đạt chỉ tiêu: Thưởng % KPIs theo bậc\nĐạt từ 70-100% chỉ tiêu: Nhận 50% thưởng KPIs\nĐạt dưới 70% chỉ tiêu: Không nhận thưởng\n",
        "prefix": "%%"
    },
    {
        "key": "thuong_kpi",
        "title": "Thưởng KPI (28)",
        "prefix": "currency"
    },
    {
        "key": "thuong_ds_ca_nhan",
        "title": "Thưởng DS cá nhân (29)",
        "prefix": "currency"
    },
    {
        "key": "thuong_ds_doi_gdvp",
        "title": "Thưởng DS đội GĐVP (30)",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_thuong_ds_digital_ca_nhan",
        "title": "% Thưởng DS Digital cá nhân (31)",
        "prefix": "currency"
    },
    {
        "key": "thuong_ds_digital_ca_nhan",
        "title": "Thưởng DS Digital cá nhân (32)",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_thuong_ds_digital_doi",
        "title": "% Thưởng DS Digital đội (33)",
        "prefix": "currency"
    },
    {
        "key": "thuong_ds_digital_doi",
        "title": "Thưởng DS Digital đội (34)",
        "prefix": "currency"
    },
    {
        "key": "thuong_dao_tao",
        "title": "Thưởng đào tạo (35)",
        "prefix": "currency"
    },
    {
        "key": "thuong_phong_van",
        "title": "Thưởng phỏng vấn (36)",
        "prefix": "currency"
    },
    {
        "key": "loi_tuc",
        "title": "Lợi tức (37)",
        "tooltip": "(37) = (2) * (25)",
        "prefix": "currency"
    },
    {
        "key": "phu_cap",
        "title": "Phụ cấp (38)",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước (39)",
        "prefix": "currency"
    },
    {
        "key": "luong_cung_thuong_kpi_loi_tuc",
        "title": " Lương cứng + Thưởng KPI + Lợi tức (40)",
        "tooltip": "(40) = (26) + (28) + (37)",
        "prefix": "currency"
    },
    {
        "key": "luong_cung_thuong_kpi_loi_tuc_thuc_tra",
        "title": "Lương cứng + Thưởng KPI + Lợi tức thực trả (41)",
        "tooltip": "- Nếu (41) >= 5.000.000 VNĐ thì (36) = (41)\n- Nếu (41) < 5.000.000 VNĐ thì (36) = 5.000.000 VNĐ",
        "prefix": "currency"
    },
    {
        "key": "tong_cac_khoan_thu_nhap",
        "title": "Tổng các khoản thu nhập (42)",
        "tooltip": "(42) = (36) + (28) + (29.1) + (29.2) + (29.3) + (30) + (31) + (33) + (34)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản trừ",
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "trich_dong_bhxh",
        "title": "Trích đóng BHXH (43)",
        "tooltip": "Áp dụng với GĐVP từ 23 tuổi trở lên",
        "prefix": "currency"
    },
    {
        "key": "cong_no",
        "title": "Công nợ (44)",
        "prefix": "currency"
    },
    {
        "key": "von_gop",
        "title": "Vốn góp (45)",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt (46)",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác (47)",
        "prefix": "currency"
    },
    {
        "key": "thue_tncn",
        "title": "Thuế thu nhập cá nhân (48)",
        "prefix": "currency",
        "tooltip": "- Nhân sự ký hợp đồng hợp tác, hợp đồng dịch vụ: Thuế thu nhập cá nhân = 10% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\nThử việc: Thuế thu nhập cá nhân = 10% * 85% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\n- Nhân sự ký hợp đồng lao động: Thuế thu nhập cá nhân tính theo phương pháp luỹ tiến"
    },
    {
        "key": "tong_cac_khoan_tru_thu_nhap",
        "title": "Tổng các khoản trừ thu nhập (Không bao gồm Thuế TNCN) (49) = (43) + (44) + (45) + (46) + (47)",
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
        "key": "id_van_phong",
        "title": "Id văn phòng"
    },
    {
        "key": "doanh_thu_doi_kinh_doanh",
        "title": "Doanh thu đội kinh doanh"
    },
    {
        "key": "doanh_thu_nhan",
        "title": "Doanh thu nhân"
    },
    {
        "key": "doanh_thu_digital_marketing",
        "title": "Doanh thu digital marketing"
    },
    {
        "key": "thu_nhap_thuc_nhan",
        "title": "Thu nhập thực nhận (50) = (42) - (48) - (49)",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5",
        "prefix": "currency"
    }
]
