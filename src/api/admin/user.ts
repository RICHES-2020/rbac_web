import { http } from "@/utils/http";

export type UserResponseType = {
  id: string;
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 姓名/昵称 */
  realname: string;
  /** 性别: Male-男，Female-女，'-'-未知 */
  gender: EnumType;
  /** 生日 */
  birthday: string;
  /** 邮箱 */
  email: string;
  /** 手机 */
  phone: string;
  /** 是否已启用：0-否，1-是 */
  enable: boolean;
  /** 备注 */
  remark: string;
  /** 当前登录用户的角色 */
  roles: Array<any>;
  /** 所属组织机构列表 */
  organizations: Array<any>;
  roleText: string;
  organizationText: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
};


/** 用户分页查询 */
export const userPageApi = (data?: object) => {
  return http.request<CommonResult<PageDataType<UserResponseType>>>("post", "/admin/v1/sys/user/page", { data });
};

/** 查询用户名是否存在 */
export const getUsernameApi = (id: string, username: string) => {
  return http.request<CommonResult<UserResponseType>>("get", `/admin/v1/sys/user/by_username?username=${username}&id=${id}`);
};


/** 新增用户 */
export const addUserApi = (data?: object) => {
  return http.request<CommonResult<UserResponseType>>("post", "/admin/v1/sys/user", { data });
};


/** 更新用户 */
export const updateUserApi = (data?: object) => {
  return http.request<CommonResult<UserResponseType>>("put", "/admin/v1/sys/user", { data });
};

/** 删除用户 */
export const deleteUserApi = (id: string) => {
  return http.request<CommonResult<void>>("delete", `/admin/v1/sys/user/${id}`);
};


/** 批量启用|禁用用户 */
export const updateEnableApi = (enable: boolean, data?: object) => {
  return http.request<CommonResult<void>>("put", `/admin/v1/sys/user/enable?enable=${enable}`, { data });
};


/** 重置密码用户 */
export const resetPasswordApi = (id: string) => {
  return http.request<CommonResult<void>>("put", `/admin/v1/sys/user/reset/password/${id}`);
};

/** 重设密码用户 */
export const updatePasswordApi = (data?: object) => {
  return http.request<CommonResult<void>>("put", "/admin/v1/sys/user/update/password", { data });
};


/** 更新用户头像 */
export const updateAvatarApi = (data?: object) => {
  return http.request<CommonResult<void>>("put", "/admin/v1/sys/user/update/avatar", { data });
};


/** 更新用户与角色关系 */
export const updateRoleRelApi = (id?: string, data?: object) => {
  return http.request<CommonResult<void>>("put", `/admin/v1/sys/user/role/${id}`, { data });
};

/** 更新用户与组织机构关系 */
export const updateOrganizationRelApi = (id?: string, data?: object) => {
  return http.request<CommonResult<void>>("put", `/admin/v1/sys/user/organization/${id}`, { data });
};


