import { http } from "@/utils/http";

export type OrganizationResponseType = {
  id: string;
  parentId: string;
  /** 组织机构名称 */
  name: string;
  /** 组织机构编码 */
  code: string;
  /** 组织机构图标 */
  icon: string;
  /** 菜单排序 */
  sort: number;
  /** 是否已启用：0-否，1-是 */
  enable: boolean;
  /** 备注 */
  remark: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
};


/** 组织机构树形结构 */
export const organizationTreeApi = (data?: object) => {
  return http.request<CommonResult<Array<OrganizationResponseType>>>("post", "/admin/v1/sys/organization/tree", { data });
};


/** 查询组织机构Code是否存在 */
export const getCodeApi = (code: string) => {
  return http.request<CommonResult<Array<OrganizationResponseType>>>("get", `/admin/v1/sys/organization/by_code?code=${code}`);
};


/** 查询组织机构是否存在 */
export const getNameApi = (id: any, parentId: any, name: string) => {
  return http.request<CommonResult<Array<OrganizationResponseType>>>("get",
    `/admin/v1/sys/organization/by_name?name=${name}&id=${id}&parentId=${parentId}`);
};


/** 新增组织机构 */
export const addOrganizationApi = (data?: object) => {
  return http.request<CommonResult<OrganizationResponseType>>("post", "/admin/v1/sys/organization", { data });
};


/** 更新组织机构 */
export const updateOrganizationApi = (data?: object) => {
  return http.request<CommonResult<OrganizationResponseType>>("put", "/admin/v1/sys/organization", { data });
};


/** 删除组织机构，really：是否物理删除，默认：是 */
export const deleteOrganizationApi = (id: string, really = true) => {
  return http.request<CommonResult<void>>("delete", `/admin/v1/sys/organization/${id}?really=${really}`);
};


/** 更新是否启用 */
export const updateEnableApi = (id: string, enable: boolean) => {
  return http.request<CommonResult<OrganizationResponseType>>("put", `/admin/v1/sys/organization/enable/${id}?enable=${enable}`);
};


