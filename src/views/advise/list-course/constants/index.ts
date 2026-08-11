export const LIST_COURSE_API = {
  list: 'get-list-course',
  candidate: 'get-candidate-login',
  showQuantumLeap: 'advise/show-quantum-leap',
} as const

export const COURSE_STATUS = {
  0: { text: 'Chưa học', color: 'bg-slate-300' },
  1: { text: 'Đang học', color: 'bg-orange-400' },
  2: { text: 'Đã học', color: 'bg-blue-400' },
  3: { text: 'Hoàn thành', color: 'bg-emerald-400' },
} as const
