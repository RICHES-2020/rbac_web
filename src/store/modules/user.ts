import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import { login, refreshToken, UserResponseType, RefreshTokenResponseType } from "@/api/login";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";
// import defaultAvatar from "@/assets/login/avatar.svg?url";
import defaultAvatar from "@/assets/user.jpg";
import { usePermissionStoreHook } from "./permission";

export const useUserStore = defineStore("life-user", {
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7,
    // 前端生成的验证码（按实际需求替换）
    captcha: "",
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(captcha: string) {
      this.captcha = captcha;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<CommonResult>((resolve, reject) => {
        login(data)
          .then(data => {
            if (data?.success) {
              const userResponse: UserResponseType = { ...data.data }
              const dataInfo: DataInfo<number> = {
                avatar: userResponse.avatar ?? defaultAvatar,
                username: userResponse.username,
                nickname: userResponse.realName,
                roles: userResponse.roles ?? [],
                permissions: userResponse.permissions ?? [],
                accessToken: userResponse.accessToken.token,
                expires: userResponse.accessToken.exp,
                refreshToken: userResponse.refreshToken.token,
              }
              setToken(dataInfo);
            }
            resolve(data);
          })
          .catch(error => {
            if (error.response?.data) {
              resolve(error.response.data);
            } else {
              reject(error);
            }
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      usePermissionStoreHook().clearAllCachePage();
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<CommonResult>((resolve, reject) => {
        refreshToken(data)
          .then(data => {
            if (data) {
              setToken(data.data as any);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
