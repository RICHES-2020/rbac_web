import { h, ref, computed, reactive, Ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { PlusColumn, FieldValues } from "plus-pro-components";

import { message } from "@/utils/message"
import { resetFormRef } from "@/utils/open"
import { updatePasswordApi, resetPasswordApi, updateRoleRelApi, updateOrganizationRelApi } from "@/api/admin/user"

export function useConfigForm(roleOptions: Ref, organizationOptions: Ref) {

  const labelWidth = "100px";

  const passwordFormColumns: PlusColumn[] = [
    {
      label: "用户名",
      prop: "username",
      valueType: "input",
      fieldProps: {
        disabled: true
      },
      formItemProps: {
        // large | default | small
        size: "default",
        labelWidth
      },
    },
    {
      label: "姓名",
      prop: "realname",
      fieldProps: {
        disabled: true
      },
      formItemProps: {
        labelWidth
      }
    },
    {
      label: "密码",
      prop: "password",
      valueType: "input",
      fieldProps: {
        type: "password",
        showPassword: true,
        placeholder: "请输入密码",
      },
      formItemProps: {
        labelWidth
      }
    },
    {
      label: "确认密码",
      prop: "repPassword",
      valueType: "input",
      fieldProps: {
        type: "password",
        showPassword: true,
        placeholder: "请再次输入密码",
      },
      formItemProps: {
        labelWidth
      }
    }
  ];


  const passwordFormRules = {
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      {
        validator: (_rule, value, callback) => {
          if (!value) return callback(new Error("请输入密码"));
          if (value.length < 6) return callback(new Error("密码长度不能少于6位"));
          callback();
        },
        trigger: ["blur", "change"]
      }
    ],
    repPassword: [
      { required: true, message: "请再次输入密码", trigger: "blur" },
      {
        validator: (_rule, value, callback) => {
          const pwd = passwordFormValues.value?.password || "";
          if (!value) return callback(new Error("请再次输入密码"));
          if (value !== pwd) return callback(new Error("两次输入的密码不一致"));
          callback();
        },
        trigger: ["blur", "change"]
      }
    ]
  }

  const passwordFormConfirmLoading = ref(false);

  const passwordFormDialog = reactive({
    title: "重设密码",
    top: "15vh",
    width: "660px",
    draggable: true,
    closeOnPressEscape: true,
    confirmLoading: passwordFormConfirmLoading,
    cancelText: "取消",
    confirmText: "确定"
  });


  // 用方法每次生成新的对象
  const defualtValue = () => ({
    id: null,
    avatar: null,
    username: null,
    realname: null,
    password: null,
    repPassword: null,
    roleIds: [],
    organizationIds: []
  });

  // 重设密码表单
  const passwordFormRef = ref();
  const passwordFormVisible = ref(false);
  const passwordFormValues = ref<FieldValues>(defualtValue());

  const passwordFormOpen = (row: any = {}) => {
    passwordFormVisible.value = true;
    resetFormRef(passwordFormRef);
    // formDialog.title = "编辑用户";
    passwordFormValues.value = cloneDeep(row);

  };

  const passwordFormSubmit = async (values: FieldValues): Promise<boolean> => {
    passwordFormConfirmLoading.value = true;
    try {
      if (values.id) {
        const res = await updatePasswordApi(values);
        if (!res?.success) {
          message(res.message, { type: "error" });
          return false;
        }
        passwordFormVisible.value = false;
        message(res.message, { type: "success" });
        return true;
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        message(`${error.response.data.message}`, { type: "error" });
      } else if (error?.message) {
        message(`${error.message}`, { type: "error" });
      }
      return false;
    } finally {
      passwordFormConfirmLoading.value = false;
    }
  };













  // 重置密码表单
  const resetPasswordFormColumns: PlusColumn[] = [
    {
      label: "用户名",
      prop: "username",
      valueType: "text"
    },
    {
      label: "姓名",
      prop: "realname",
      valueType: "text"
    }
  ];

  const resetPasswordFormOpen = (row: any = {}) => {
    resetPasswordFormVisible.value = true;
    resetPasswordFormValues.value = cloneDeep(row);
  };

  const resetPasswordFormRef = ref();
  const resetPasswordFormVisible = ref(false);
  const resetPasswordFormValues = ref<FieldValues>(defualtValue());
  const resetPasswordFormConfirmLoading = ref(false);

  const resetPasswordFormDialog = reactive({
    title: "重置密码",
    top: "15vh",
    width: "660px",
    draggable: true,
    closeOnPressEscape: true,
    confirmLoading: resetPasswordFormConfirmLoading,
    cancelText: "取消",
    confirmText: "确定"
  });

  const resetPasswordFormSubmit = async (values: FieldValues): Promise<boolean> => {
    resetPasswordFormConfirmLoading.value = true;
    try {
      if (values.id) {
        const res = await resetPasswordApi(values.id as string);
        if (!res?.success) {
          message(res.message, { type: "error" });
          return false;
        }
        resetPasswordFormVisible.value = false;
        message(res.message, { type: "success" });
        return true;
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        message(`${error.response.data.message}`, { type: "error" });
      } else if (error?.message) {
        message(`${error.message}`, { type: "error" });
      }
      return false;
    } finally {
      resetPasswordFormConfirmLoading.value = false;
    }
  };



















  // 分配角色表单
  const updateRoleRelFormColumns: PlusColumn[] = [
    {
      label: "用户名",
      prop: "username",
      valueType: "text"
    },
    {
      label: "姓名",
      prop: "realname",
      valueType: "text"
    },
    {
      label: "所属角色",
      prop: "roleIds",
      valueType: "select",
      options: computed(() => roleOptions.value || []),
      fieldProps: {
        multiple: true,
        clearable: true,
        placeholder: "请选择角色",
        style: { width: "90%" }
      },
      formItemProps: { labelWidth },
      rules: [{ required: true, message: "请选择角色", trigger: "change" }]
    }
  ];

  const updateRoleRelFormOpen = (row) => {
    updateRoleRelFormVisible.value = true;
    updateRoleRelFormValues.value = cloneDeep(row);
    if (row.roles && row.roles.length > 0) {
      updateRoleRelFormValues.value.roleIds = row.roles.map(role => {
        return role.id;
      });
    }
  };

  const updateRoleRelFormRef = ref();
  const updateRoleRelFormVisible = ref(false);
  const updateRoleRelFormValues = ref<FieldValues>(defualtValue());
  const updateRoleRelFormConfirmLoading = ref(false);

  const updateRoleRelFormDialog = reactive({
    title: "分配角色",
    top: "15vh",
    width: "660px",
    draggable: true,
    closeOnPressEscape: true,
    confirmLoading: updateRoleRelFormConfirmLoading,
    cancelText: "取消",
    confirmText: "确定"
  });


  const updateRoleRelFormSubmit = async (values: FieldValues): Promise<boolean> => {
    updateRoleRelFormConfirmLoading.value = true;
    try {
      if (values.id) {
        const roleIds = Array.isArray(values.roleIds) ? values.roleIds : [];
        const res = await updateRoleRelApi(values.id as string, [...roleIds]);
        if (!res?.success) {
          message(res.message, { type: "error" });
          return false;
        }
        updateRoleRelFormVisible.value = false;
        message(res.message, { type: "success" });
        return true;
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        message(`${error.response.data.message}`, { type: "error" });
      } else if (error?.message) {
        message(`${error.message}`, { type: "error" });
      }
      return false;
    } finally {
      updateRoleRelFormConfirmLoading.value = false;
    }
  };







  // 分配组织机构表单
  const updateOrganizationRelFormColumns: PlusColumn[] = [
    {
      label: "用户名",
      prop: "username",
      valueType: "text"
    },
    {
      label: "姓名",
      prop: "realname",
      valueType: "text"
    },
    {
      label: "所属组织",
      prop: "organizationIds",
      valueType: "cascader",
      options: computed(() => organizationOptions.value),
      fieldProps: {
        props: {
          multiple: true,
          checkStrictly: true, // 允许选择任意级别
          emitPath: false, // 只返回选中节点的值，不返回完整路径
          value: 'id', // 指定 value 字段
          label: 'name', // 指定 label 字段
          children: 'children' // 指定 children 字段          
        },
        placeholder: "请选择组织机构",
        clearable: true,
        style: {
          width: "90%"
        }
      },
      rules: [{ required: true, message: "请选择组织机构", trigger: "change" }]
    },
  ];

  const updateOrganizationRelFormOpen = (row) => {
    updateOrganizationRelFormVisible.value = true;
    updateOrganizationRelFormValues.value = cloneDeep(row);
    if (row.organizations && row.organizations.length > 0) {
      updateOrganizationRelFormValues.value.organizationIds = row.organizations.map(org => {
        return org.id;
      });
    }
  };

  const updateOrganizationRelFormRef = ref();
  const updateOrganizationRelFormVisible = ref(false);
  const updateOrganizationRelFormValues = ref<FieldValues>(defualtValue());
  const updateOrganizationRelFormConfirmLoading = ref(false);

  const updateOrganizationRelFormDialog = reactive({
    title: "分配组织机构",
    top: "15vh",
    width: "660px",
    draggable: true,
    closeOnPressEscape: true,
    confirmLoading: updateOrganizationRelFormConfirmLoading,
    cancelText: "取消",
    confirmText: "确定"
  });


  const updateOrganizationRelFormSubmit = async (values: FieldValues): Promise<boolean> => {
    updateOrganizationRelFormConfirmLoading.value = true;
    try {
      if (values.id) {
        const organizationIds = Array.isArray(values.organizationIds) ? values.organizationIds : [];
        const res = await updateOrganizationRelApi(values.id as string, [...organizationIds]);
        if (!res?.success) {
          message(res.message, { type: "error" });
          return false;
        }
        updateOrganizationRelFormVisible.value = false;
        message(res.message, { type: "success" });
        return true;
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        message(`${error.response.data.message}`, { type: "error" });
      } else if (error?.message) {
        message(`${error.message}`, { type: "error" });
      }
      return false;
    } finally {
      updateOrganizationRelFormConfirmLoading.value = false;
    }
  };



  return {
    passwordFormColumns,
    passwordFormRules,
    passwordFormDialog,
    passwordFormRef,
    passwordFormVisible,
    passwordFormValues,
    passwordFormOpen,
    passwordFormSubmit,


    resetPasswordFormColumns,
    resetPasswordFormDialog,
    resetPasswordFormRef,
    resetPasswordFormVisible,
    resetPasswordFormValues,
    resetPasswordFormOpen,
    resetPasswordFormSubmit,

    updateRoleRelFormColumns,
    updateRoleRelFormDialog,
    updateRoleRelFormRef,
    updateRoleRelFormVisible,
    updateRoleRelFormValues,
    updateRoleRelFormOpen,
    updateRoleRelFormSubmit,


    updateOrganizationRelFormColumns,
    updateOrganizationRelFormDialog,
    updateOrganizationRelFormRef,
    updateOrganizationRelFormVisible,
    updateOrganizationRelFormValues,
    updateOrganizationRelFormOpen,
    updateOrganizationRelFormSubmit,
  };
}
