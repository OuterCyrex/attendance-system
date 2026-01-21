/**
 * API 接口类型定义模块
 *
 * 提供所有后端接口的类型定义
 *
 * ## 主要功能
 *
 * - 通用类型（分页参数、响应结构等）
 * - 认证类型（登录、用户信息等）
 * - 系统管理类型（用户、角色等）
 * - 全局命名空间声明
 *
 * ## 使用场景
 *
 * - API 请求参数类型约束
 * - API 响应数据类型定义
 * - 接口文档类型同步
 *
 * ## 注意事项
 *
 * - 在 .vue 文件使用需要在 eslint.config.mjs 中配置 globals: { Api: 'readonly' }
 * - 使用全局命名空间，无需导入即可使用
 *
 * ## 使用方式
 *
 * ```typescript
 * const params: Api.Auth.LoginParams = { userName: 'admin', password: '123456' }
 * const response: Api.Auth.UserInfo = await fetchUserInfo()
 * ```
 *
 * @module types/api/api
 * @author Art Design Pro Team
 */

declare namespace Api {
  /** 认证类型 */
  namespace Auth {
    /** 登录参数 */
    interface LoginParams {
      username: string
      password: string
    }

    /** 登录响应 */
    interface LoginResponse {
      token: string
      userInfo: userInfo
      userInfo: userInfo
    }

    /** 用户信息 */
    interface userInfo {
      id: string
      username: string
      password: string
      id: string
      username: string
      password: string
      realName: string
      teacherNo: string
      teacherNo: string
      phone: string
      email: string
      email: string
      department: string
      collegeNo: string
      status: number
      attendanceThreshold: number
      enableEmailNotification: boolean
      role: string
    }

    interface updateSelfParams {
      username: string
      password: string
      realName: string
      teacherNo: string
      phone: string
      email: string
      status: number
      department: string
      attendanceThreshold: number
      enableEmailNotification: boolean
    }
  }

  namespace Class {
    interface GetClassListParams {
      className: string
      teacherNo: string
      grades: string[]
      majors: string[]
      collegeName: string
      pageNum: number
      pageSize: number
    }

    interface classInfo {
      id: string
      className: string
      teacherNo: string
      count: number
      grade: string
      major: string
      createTime: any
      updateTime: any
      isDelete: any
      teacherName: string
      collegeName: string
    }

    interface addClassParams {
      className: string
      teacherNo: string
      count: number
      grade: string
      major: string
      createTime: string
      updateTime: string
      isDelete: number
    }

    interface updateClassParams {
      id: string
      className: string
      teacherNo: string
      count: number
      grade: string
      major: string
      createTime: string
      updateTime: string
      isDelete: number
    }
  }

  namespace Schedule {
    interface GetScheduleListParams {
      teacherNo: string
      className: string
      courseName: string
      teacherName: string
      courseType: string
      semesterName: string
      collegeName: string
      pageNum: number
      pageSize: number
    }

    interface scheduleInfo {
      id: string
      courseNo: string
      orderNo: string
      courseName: string
      weekday: string
      expectedCount: number
      weekRange: string
      startPeriod: number
      endPeriod: number
      classroom: string
      teacherName: string
      courseType: string
      semesterName: string
      createTime: string
      updateTime: string
      classNames: string[]
      inClassTime: boolean
    }

    interface attendanceInfo {
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
    }

    interface updateClassParams {
      id: string
      courseNo: string
      orderNo: string
      courseName: string
      weekday: string
      expectedCount: number
      weekRange: string
      startPeriod: number
      endPeriod: number
      classroom: string
      teacherName: string
      courseType: string
      semesterName: string
      createTime: string
      updateTime: string
    }

    interface addScheduleParams {
      id: string
      courseNo: string
      orderNo: string
      courseName: string
      weekday: string
      expectedCount: number
      weekRange: string
      startPeriod: number
      endPeriod: number
      classroom: string
      teacherName: string
      courseType: string
      semesterName: string
      createTime: string
      updateTime: string
    }
  }

  namespace Teacher {
    interface queryTeacherParams {
      teacherNo: string
      department: string
      realName: string
      pageNum: number
      pageSize: number
    }

    interface updateTeacherParams {
      username: string
      realName: string
      teacherNo: string
      phone: string
      email: string
      department: string
      status: number
      attendanceThreshold: number
      enableEmailNotification: boolean
    }

    interface addTeacherParams {
      username: string
      password: string
      realName: string
      teacherNo: string
      phone: string
      email: string
      department: string
      status: number
      attendanceThreshold: number
      enableEmailNotification: boolean
      collegeNo: string
    }

    interface teacherInfo {
      id: string
      username: string
      password: any
      realName: string
      teacherNo: string
      phone: string
      email: string
      department: string
      collegeNo: string
      status: number
      attendanceThreshold: number
      enableEmailNotification: boolean
      lastLoginTime: any
      lastLoginIp: any
      remark: any
      createTime: string
      updateTime: string
      isDeleted: number
    }
  }

  namespace Misc {

  namespace Misc {
    interface collegeInfo {
      id: string
      name: string
      collegeNo: string
    }

    interface semesterInfo {
      id: string
      semesterName: string
      startDate: string
      endDate: string
      weeks: number
      createTime: string
      updateTime: string
    }
  }

  namespace Chart {
    interface getClassChartParams {
      collegeName: string
      teacherName: string
      className: string
      granularity: number
      semesterName: string
    }

    interface getCourseChartParams {
      teacherName: string
      orderNo: string
      semesterName: string
      granularity: number
    }
  }

}
