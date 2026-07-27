import type { PayslipData, PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "doanh_thu_doi_kd",
        "title": "Doanh thu đội KD (1)",
        "prefix": "currency"
    },
    {
        "key": "doanh_thu_qlhv",
        "title": "Doanh thu QLHV (2)",
        "prefix": "currency"
    },
    {
        "key": "chuyen_hp",
        "title": "Chuyển học phí (3)",
        "prefix": "currency"
    },
    {
        key: (row: PayslipData) =>
            (row.doanhThuDoiKd as number) + (row.doanhThuQlhv as number) + (row.chuyenHp as number),
        title: 'Tổng doanh thu: (4)=(1)+(2)+(3)',
        bold: true,
        prefix: 'currency',
    },
    {
        "key": "luong_doi_kd",
        "title": "Lương đội kinh doanh (5)",
        "prefix": "currency"
    },
    {
        "key": "luong_doi_qlhv",
        "title": "Lương quản lý học viên (6)",
        "prefix": "currency"
    },
    {
        key: (row: PayslipData) => (row.luongDoiKd as number) + (row.luongDoiQlhv as number),
        title: 'Tổng chi phí lương (7)=(5)+(6)',
        bold: true,
        prefix: 'currency',
    },
    {
        "key": "chi_phi_sp",
        "title": "Chi phí sản phẩm (8)",
        "prefix": "currency"
    },
    {
        "key": "phi_backoffice",
        "title": "Phí tổng, backoffice 12,5%: (9) = 12,5% * (4)",
        "bold": true,
        "prefix": "currency"
    },
    {
        "key": "doanh_so_tai_diem",
        "title": "Doanh số tại điểm (10)",
        "prefix": "currency"
    },
    {
        "key": "phan_tram_chi_sp_tai_diem",
        "title": "% Chi phí tại điểm (11)",
        "prefix": "%"
    },
    {
        "key": "chi_nha",
        "title": "Chi nhà (12)",
        "prefix": "currency"
    },
    {
        "key": "chi_khau_hao",
        "title": "Chi khấu hao (13)",
        "prefix": "currency"
    },
    {
        "key": "chi_khac",
        "title": "Chi khác (14)",
        "prefix": "currency"
    },
    {
        "key": "phi_phong_hoc_gv",
        "title": "Phí phòng của GV (15)",
        "prefix": "currency"
    },
    {
        "key": "thuong_team_lead",
        "title": "Thưởng Team leader (16)",
        "prefix": "currency"
    },
    {
        "key": "loi_nhuan_kd_tai_diem",
        "title": "Lợi nhuận đội kinh doanh tại điểm: (17)=(4)-(7)-(8)-(9)-(12)-(13)-(14)+(15)-(16)",
        "prefix": "currency"
    },
    {
        "key": "wow_1",
        "title": "Số Wow (18)"
    },
    {
        "key": "wow_2",
        "title": "Điểm Wow (19)"
    },
    {
        "key": "thu_nhap_co_tuc",
        "title": "Thu nhập cổ tức: (20) = 50% * (17) * % cổ phần của GĐVP",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_wow",
        "title": "Thu nhập Wow: (21) = 2% * (4) *(19)",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_truong_phong_co_so",
        "title": "Thu nhập phỏng vấn, đào tạo, lead ca làm việc: (22) ",
        "prefix": "currency"
    },
    {
        key: (row: PayslipData) => (row.thuNhapCoTuc as number) + (row.thuNhapWow as number),
        title: 'Tổng thu nhập (23) = (20) + (21)',
        prefix: 'currency',
    },
    {
        "key": "loi_nhuan_giu_lai",
        "title": "Lợi nhuận còn lại 50%: (24) = 50%*(16)",
        "prefix": "currency"
    },
    {
        "key": "cong_no",
        "title": "Công nợ (25)",
        "prefix": "currency"
    },
    {
        "key": "tien_phu_cap",
        "title": "Phụ cấp (26)",
        "prefix": "currency"
    },
    {
        "key": "thuong",
        "title": "Thưởng (27)",
        "prefix": "currency"
    },
    {
        "key": "tam_ung",
        "title": "Tạm ứng (28)",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt (29)",
        "prefix": "currency"
    },
    {
        "key": "tru_khac",
        "title": "Trừ khác (30)",
        "prefix": "currency"
    },
    {
        "key": "salary",
        "title": "Lương thực nhận (31) = (22)+(23)-(25)+(26)+(27)-(28)-(29)-(30)",
        "prefix": "currency"
    }
]
