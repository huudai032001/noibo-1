import type { PayslipData, PayslipRowConfig } from '../../../models/phieu-luong.model'

export const data: PayslipRowConfig[] = [
    {
        "key": "muc_luong",
        "title": "Mức lương",
        "prefix": "currency"
    },
    {
        "key": "kpi_deadline",
        "title": "% KPI hoàn thành công việc phòng ban",
        "prefix": "%"
    },
    {
        key: (row: PayslipData) => (row.attendance as number) + (row.soNghiPhepNam as number) + (row.soNghiPhepKhac as number),
        title: 'Tổng công tháng',
    },
    {
        "key": "loi_nhuan_kd_tai_diem",
        "title": "Lợi nhuận tại điểm",
        "prefix": "currency"
    },
    {
        "key": "loi_tuc",
        "title": "Lợi tức",
        "prefix": "currency"
    },
    {
        "key": "doanh_so_doi_trong_khu_vuc",
        "title": "Doanh số đội trong khu vực",
        "prefix": "currency"
    },
    {
        "key": "wow_2",
        "title": "Điểm wow",
        "bold": true
    },
    {
        "key": "kpi",
        "title": "KPI",
        "prefix": "%"
    },
    {
        "key": "thuong_kpi",
        "title": "Thưởng KPI",
        "bold": true,
        "prefix": "currency"
    },
    {
        "key": "loi_nhuan_vp_con_lai",
        "title": "Lợi nhuận văn phòng còn lại",
        "prefix": "currency"
    },
    {
        "key": "tong_thu_nhap",
        "title": "Tổng thu nhập",
        "prefix": "currency"
    },
    {
        "key": "tien_phu_cap",
        "title": "Phụ cấp",
        "prefix": "currency"
    },
    {
        "key": "thuong",
        "title": "Thưởng",
        "prefix": "currency"
    },
    {
        "key": "sinh_nhat",
        "title": "Sinh nhật",
        "prefix": "currency"
    },
    {
        "key": "phat",
        "title": "Phạt",
        "prefix": "currency"
    },
    {
        "key": "thu_nhap_thieu_thang_truoc",
        "title": "Thu nhập thiếu tháng trước",
        "prefix": "currency"
    },
    {
        "key": "tam_ung",
        "title": "Tạm ứng",
        "prefix": "currency"
    },
    {
        "key": "salary",
        "title": "Lương thực nhận",
        "prefix": "currency"
    }
]
