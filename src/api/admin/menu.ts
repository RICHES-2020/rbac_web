import { http } from "@/utils/http";

export type MenuResponseType = {
  id: string;
  parentId: string;
  /** 名称 */
  name: string;
  /** 前端路由名称 */
  routerName: string;
  /** 前端路由路径 */
  routerPath: string;
  /** 前端路由的组件路径 */
  routerComponent: string;
  /** 菜单图标 */
  icon: string;
  /** 请求方法: GET/POST/PUT/DELETE/PATCH */
  method: string;
  /** 请求Url */
  url: string;
  /** 菜单类型 */
  type: any;
  /** 菜单排序 */
  sort: number;
  /** 权限标识 */
  authKey: string;
  /** 是否已启用：0-否，1-是 */
  enable: boolean;
  /** 备注 */
  remark: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;

  children: Array<MenuResponseType>;
};


/** 菜单树形结构 */
export const menuTreeApi = (data?: object) => {
  return http.request<CommonResult<Array<MenuResponseType>>>("post", "/admin/v1/sys/menu/tree", { data });
};

/** 当前用户菜单列表 */
export const menuWithUserApi = () => {
  return http.request<CommonResult<Array<MenuResponseType>>>("get", "/admin/v1/sys/menu/list_by_user");
};

/** 按角色Id查询菜单列表 */
export const menuWithRoleApi = (roleId?: string) => {
  return http.request<CommonResult<Array<MenuResponseType>>>("get", `/admin/v1/sys/menu/list_by_role/${roleId}`);
};

/** 查询菜单Id是否存在 */
export const getIdApi = (id: string) => {
  return http.request<CommonResult<Array<MenuResponseType>>>("get", `/admin/v1/sys/menu/by_id?id=${id}`);
};


/** 查询菜单是否存在 */
export const getNameApi = (id: any, parentId: any, name: string) => {
  return http.request<CommonResult<Array<MenuResponseType>>>("get",
    `/admin/v1/sys/menu/by_name?name=${name}&id=${id}&parentId=${parentId}`);
};


/** 新增菜单 */
export const addMenuApi = (data?: object) => {
  return http.request<CommonResult<MenuResponseType>>("post", "/admin/v1/sys/menu", { data });
};


/** 更新菜单 */
export const updateMenuApi = (data?: object) => {
  return http.request<CommonResult<MenuResponseType>>("put", "/admin/v1/sys/menu", { data });
};


/** 删除菜单，really：是否物理删除，默认：是 */
export const deleteMenuApi = (id: string, really = true) => {
  return http.request<CommonResult<void>>("delete", `/admin/v1/sys/menu/${id}?really=${really}`);
};


/** 更新是否启用 */
export const updateEnableApi = (id: string, enable: boolean) => {
  return http.request<CommonResult<MenuResponseType>>("put", `/admin/v1/sys/menu/enable/${id}?enable=${enable}`);
};


