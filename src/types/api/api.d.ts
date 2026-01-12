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
      userInfo: {
        realName: string
        phone: string
        id: string
        department: string
        teacherNo: string
        email: string
        username: string
      }
    }

    /** 用户信息 */
    interface userInfo: {
      realName: string
      phone: string
      id: string
      department: string
      teacherNo: string
      email: string
      username: string
    }

    interface GetClassListParams {
      className: string
      teacherNo: string
      grade: string
      major: string
      pageNum: number
      pageSize: number
    }

    interface classInfo {
      className: string
      teacherNo: string
      count: number
      grade: string
      major: string
    }

    interface GetScheduleParams {
      teacherNo: number
      className: string
      courseName: string
      weekday: number
      semester: string
      schoolYear: string
      pageNum: number
      pageSize: number
    }

    interface scheduleInfo {
      id: number
      courseName: string
      teacherNo: number
      className: string
      weekday: number
      startTime: {
        hour: number
        minute: number
        second: number
        nano: number
      }
      endTime: {
        hour: number
        minute: number
        second: number
        nano: number
      }
      classroom: string
      semester: string
      schoolYear: string
      createTime: string
      updateTime: string
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

    interface queryTeacherParams {
      teacherNo: string
      department: string
      realName: string
      pageNum: number
      pageSize: number
    }

    interface updateTeacherParams {
      username: string
      password: string
      realName: string
      teacherNo: string
      phone: string
      email: string
      department: string
      status: number
      attendanceThreshold: number
      enableEmailNotification: number
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

    interface collegeInfo {
      id: string
      name: string
      collegeNo: string
    }
  }
}
