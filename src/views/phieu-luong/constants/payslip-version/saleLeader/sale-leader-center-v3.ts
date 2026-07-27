import type { PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "none",
        "title": "Thông tin chung",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "chi_tieu_doanh_so_doi",
        "title": "Chỉ tiêu Doanh số đội (1)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Kết quả đạt được trong tháng",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "doanh_so_ca_nhan",
        "title": "Doanh số cá nhân (2)",
        "prefix": "currency"
    },
    {
        "title": "Doanh số Digital",
        "key": "doanh_so_digital",
        "tooltip": "",
        "prefix": "currency"
    },
    {
        "key": "tong_doanh_so",
        "title": "Tổng doanh số (3)",
        "prefix": "currency"
    },
    {
        "key": "doanh_so_tu_van_moi",
        "title": "Doanh số tư vấn (mới) (4)",
        "prefix": "currency"
    },
    {
        "key": "doanh_so_tu_van_nhan",
        "title": "Doanh số tư vấn (nhân) (5)",
        "prefix": "currency"
    },
    {
        "key": "ti_le_tu_van_thanh_cong",
        "title": "Tỉ lệ tư vấn thành công của cá nhân SL (6)",
        "prefix": "%%"
    },
    {
        "key": "kpi_ds_doi_dat_duoc",
        "title": "KPI DS đội đạt được (7)",
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
        "key": "phan_tram_thuong_ds_ca_nhan",
        "title": "% Thưởng DS cá nhân (8)",
        "tooltip": "- Nếu (2) từ 25.000.000đ trở lên, nhận % thưởng theo bậc\n- Nếu (2) dưới 25.000.000đ, nhận 6%",
        "prefix": "%%"
    },
    {
        "key": "thuong_ds_ca_nhan",
        "title": "Thưởng DS cá nhân (9)",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_thuong_tu_van_moi",
        "title": "% Thưởng tư vấn mới (10)",
        "tooltip": "- Nếu (6) từ 50% trở lên, nhận % thưởng theo bậc\n- Nếu (6) dưới 50%, nhận 50% mức thưởng theo bậc",
        "prefix": "%%"
    },
    {
        "key": "thuong_tu_van",
        "title": "Thưởng tư vấn (11) = (4) * (10) + (5) * 3%",
        "tooltip": "- Nếu (6) từ 50% trở lên, nhận % thưởng theo bậc\n- Nếu (6) dưới 50%, nhận 50% mức thưởng theo bậc",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_thuong_ds_doi",
        "title": "% Thưởng DS đội (12)",
        "tooltip": "- Nếu (7) từ 100% trở lên, nhận % thưởng theo bậc\n- Nếu (7) từ 70% đến dưới 100%, nhận 80% mức thưởng theo bậc\n- Nếu (7) dưới 70% đến dưới 100%, nhận 50% mức thưởng theo bậc",
        "prefix": "currency"
    },
    {
        "key": "thuong_ds_doi",
        "title": "Thưởng DS đội (13) = (3) * (12)",
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
        "key": "thuong_dao_tao",
        "title": "Thưởng đào tạo (14)",
        "prefix": "currency"
    },
    {
        "key": "thuong_phong_van",
        "title": "Thưởng phỏng vấn (15)",
        "prefix": "currency"
    },
    {
        "key": "thuong_khac",
        "title": "Thưởng khác (16)",
        "prefix": "currency"
    },
    {
        "key": "phu_cap",
        "title": "Phụ cấp (17)",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước (18)",
        "prefix": "currency"
    },
    {
        "key": "tong_cac_khoan_thu_nhap",
        "title": "Tổng các khoản thu nhập (19) = (9) + (11) + (13) + (14) + (15) + (16) + (17) + (18)",
        "prefix": "currency"
    },
    {
        "key": "none",
        "title": "Các khoản trừ",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5"
    },
    {
        "key": "ao_tvv",
        "title": "Áo TVV (20)",
        "prefix": "currency"
    },
    {
        "key": "the_ten",
        "title": "Thẻ tên (21)",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt (22)",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác (23)",
        "prefix": "currency"
    },
    {
        "key": "thue_tncn",
        "title": "Thuế thu nhập cá nhân (24)",
        "prefix": "currency",
        "tooltip": "- Nhân sự ký hợp đồng hợp tác, hợp đồng dịch vụ: Thuế thu nhập cá nhân = 10% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\nThử việc: Thuế thu nhập cá nhân = 10% * 85% * (Tổng các khoản thu nhập -Tổng các khoản trừ thu nhập)\n- Nhân sự ký hợp đồng lao động: Thuế thu nhập cá nhân tính theo phương pháp luỹ tiến"
    },
    {
        "key": "tong_cac_khoan_tru_thu_nhap",
        "title": "Tổng các khoản trừ thu nhập (Không bao gồm Thuế TNCN) (25) = (20) + (21) + (22) + (23)",
        "prefix": "currency"
    },
    {
        "key": "thu_viec",
        "title": "Thử việc",
        "prefix": "currency"
    },
    {
        "key": "ghi_chu",
        "title": "Ghi chú"
    },
    {
        "key": "thu_nhap_thuc_nhan",
        "title": "Thu nhập thực nhận (26) = (19) - (25) - (24)",
        "spaceBeforeRow": true,
        "titleClassName": "bold text-sm-h5",
        "prefix": "currency"
    }
]
