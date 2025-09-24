import { http } from "@/utils/http";

export type RoleResponseType = {
  id: string;
  /** 名称 */
  name: string;
  /** 是否为固定的角色（系统内置不可改变） */
  immutable: string;
  /** 备注 */
  remark: string;
  /** 是否已启用：0-否，1-是 */
  enable: boolean;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
};


/** 查询角色列表 */
export const roleAllApi = (data?: object) => {
  return http.request<CommonResult<Array<RoleResponseType>>>("post", "/admin/v1/sys/role/list", { data });
};

/** 查询角色Id是否存在 */
export const getIdApi = (id: string) => {
  return http.request<CommonResult<Array<RoleResponseType>>>("get", `/admin/v1/sys/role/by_id?id=${id}`);
};


/** 查询角色是否存在 */
export const getNameApi = (id: string, name: string) => {
  return http.request<CommonResult<Array<RoleResponseType>>>("get", `/admin/v1/sys/role/by_name?name=${name}&id=${id}`);
};


/** 新增角色 */
export const addRoleApi = (data?: object) => {
  return http.request<CommonResult<RoleResponseType>>("post", "/admin/v1/sys/role", { data });
};


/** 更新角色 */
export const updateRoleApi = (data?: object) => {
  return http.request<CommonResult<RoleResponseType>>("put", "/admin/v1/sys/role", { data });
};


/** 删除角色 */
export const deleteRoleApi = (id: string) => {
  return http.request<CommonResult<void>>("delete", `/admin/v1/sys/role/${id}`);
};


/** 更新是否启用 */
export const updateEnableApi = (id: string, enable: boolean) => {
  return http.request<CommonResult<RoleResponseType>>("put", `/admin/v1/sys/role/enable/${id}?enable=${enable}`);
};



/** 保存角色与菜单的关系 */
export const configRoleMenuApi = (id: string, data?: object) => {
  return http.request<CommonResult<RoleResponseType>>("put", `/admin/v1/sys/role/config/${id}`, { data });
};


