import { http } from "@/utils/http";

export type UserToken = {
    jti: string;
    exp: number;
    token: string;
};

export type UserResponseType = {
    id: string;
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    realName: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: UserToken;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: UserToken;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
};

export type RefreshTokenResponseType = {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
};


/** 登录 */
export const login = (data?: object) => {
    return http.request<CommonResult<UserResponseType>>("post", "/admin/v1/login", { data });
};

/** 刷新token */
export const refreshToken = (data?: object) => {
    return http.request<CommonResult<RefreshTokenResponseType>>("post", "/admin/v1/refresh_token", { data });
};