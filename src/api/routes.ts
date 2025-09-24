import { http } from "@/utils/http";

type Result = {
  success: boolean;
  message: string;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/admin/v1/sys/router/list");
};
