// 定义考勤记录类型
export interface AttendanceRecord {
  id: string
  courseId: string
  checkTime: string
  actualCount: number
  expectedCount: number
  attendanceRate: number
  imageUrl: string
  checkType: number
  status: number
  remark: string
  createTime: string
  updateTime: string
  isDeleted: number
}

// 定义分页响应类型
export interface PageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 定义API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}