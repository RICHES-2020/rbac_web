import { ref, computed, reactive, nextTick, Ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import type { PlusColumn, FieldValues } from "plus-pro-components";

import { message } from "@/utils/message"
import { resetFormRef } from "@/utils/open"
import { getUsernameApi, addUserApi, updateUserApi } from "@/api/admin/user"
import { genderOptions } from "../utils/enum";


export function useForm(roleOptions: Ref, organizationOptions: Ref) {

  const labelWidth = "100px";

  const formColumns: PlusColumn[] = [
    {
      label: "用户名",
      prop: "username",
      valueType: "input",
      tooltip: "用户名长度为4~32之间，只能包含字母、数字、下划线，且以字母开头",
      // colProps: {
      //   style: {
      //     marginLeft: 0
      //   }
      // },
      fieldProps: computed(() => ({
        style: {
          // 宽度
          width: "90%"
        },
        placeholder: "请输入用户名",
        disabled: !!formValues.value?.id
      })),
      formItemProps: {
        // large | default | small
        size: "default",
        labelWidth
      },
      rules: [
        {
          async validator(_rule, value, callback) {
            if (!value) return callback();
            // 本地格式不通过时不发请求
            if (!/^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(value)) return callback();
            try {
              const res = await getUsernameApi(formValues.value?.id as string, value);
              if (res?.success && res.data != null) {
                callback(new Error("用户名已存在"));
              } else {
                callback();
              }
            } catch (e: any) {
              callback(new Error(e?.response?.data?.message || "校验失败，请稍后重试"));
            }
          },
          trigger: ["change"]
        }
      ]
    },
    {
      label: "姓名",
      prop: "realname",
      tooltip: "填写真实姓名",
      fieldProps: {
        size: "default",
        placeholder: "真实姓名",
        style: { width: "90%" }
      },
      formItemProps: {
        labelWidth
      }
    },
    // {
    //   label: "密码",
    //   prop: "password",
    //   valueType: "input",
    //   fieldProps: {
    //     type: "password",
    //     showPassword: true,
    //     placeholder: "请输入密码（新增必填，编辑不填则不修改）",
    //   },
    //   formItemProps: {
    //     labelWidth
    //   }
    // },
    // {
    //   label: "确认密码",
    //   prop: "repeatPassword",
    //   valueType: "input",
    //   fieldProps: {
    //     type: "password",
    //     showPassword: true,
    //     placeholder: "请再次输入密码",
    //   },
    //   formItemProps: {
    //     labelWidth
    //   }
    // },
    {
      label: "生日",
      prop: "birthday",
      valueType: "date-picker",
      fieldProps: {
        style: {
          // 宽度
          width: "90%"
        },
        placeholder: "请选择日期",
        type: "date",
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD"
      },
      formItemProps: {
        labelWidth
      },
      rules: [{ required: true, message: "请选择时间", trigger: "change" }]
    },
    {
      label: "手机号码",
      prop: "phone",
      fieldProps: {
        placeholder: "请输入手机号码",
        style: { width: "90%" }
      },
      formItemProps: {
        labelWidth
      }
    },
    {
      label: "邮箱",
      prop: "email",
      fieldProps: {
        placeholder: "请输入邮箱",
        style: { width: "90%" }
      },
      formItemProps: {
        labelWidth
      }
    },
    {
      label: "性别",
      prop: "gender",
      valueType: "select",
      options: computed(() => genderOptions),
      fieldProps: {
        placeholder: "请选择性别",
        style: { width: "90%" },
        clearable: true
      },
      formItemProps: { labelWidth },
      rules: [{ required: true, message: "请选择性别", trigger: "change" }]
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
      formItemProps: { labelWidth },
      rules: [{ required: true, message: "请选择组织机构", trigger: "change" }]
    },
    {
      label: "是否启用",
      prop: "enable",
      valueType: "switch",
      fieldProps: {
        placeholder: "是否启用",
        style: { width: "90%" }
      },
      formItemProps: {
        labelWidth
      }
    },
    {
      label: "备注",
      prop: "remark",
      valueType: "textarea",
      fieldProps: {
        maxlength: 200,
        showWordLimit: true,
        autosize: { minRows: 2, maxRows: 4 },
        placeholder: "说明",
        style: { width: "90%" }
      },
      formItemProps: {
        labelWidth
      }
    }
  ];


  const formRules = {
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      {
        pattern: /^[A-Za-z][A-Za-z0-9_]{4,29}$/,
        message: "以字母开头，5-30个字符，仅支持字母/数字/下划线",
        trigger: ["blur", "change"]
      }
    ],
    realname: [
      {
        required: true,
        message: "请输入姓名",
        trigger: "blur"
      }
    ],
    // password: [
    //   { required: true, message: "请输入密码", trigger: "blur" },
    //   {
    //     validator: (_rule, value, callback) => {
    //       const isAdd = !formValues.value?.id;
    //       // 新增：必填；编辑：可不填
    //       if (isAdd && !value) return callback(new Error("请输入密码"));
    //       if (!value) return callback(); // 编辑且未填，跳过
    //       if (value.length < 6) return callback(new Error("密码长度不能少于6位"));
    //       callback();
    //     },
    //     trigger: ["blur", "change"]
    //   }
    // ],
    // repeatPassword: [
    //   { required: true, message: "请再次输入密码", trigger: "blur" },
    //   {
    //     validator: (_rule, value, callback) => {
    //       const pwd = formValues.value?.password || "";
    //       const isAdd = !formValues.value?.id;
    //       // 新增：必填；编辑：当 password 有值时必填
    //       if ((isAdd || pwd) && !value) return callback(new Error("请再次输入密码"));
    //       if (!value) return callback();
    //       if (value !== pwd) return callback(new Error("两次输入的密码不一致"));
    //       callback();
    //     },
    //     trigger: ["blur", "change"]
    //   }
    // ],
    // email: [
    //   { required: true, message: "请输入邮箱", trigger: "blur" },
    //   {
    //     pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    //     message: "邮箱格式不正确",
    //     trigger: ["blur", "change"]
    //   }
    // ],
    phone: [
      { required: true, message: "请输入手机号码", trigger: "blur" },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: "手机号格式不正确",
        trigger: ["blur", "change"]
      }
    ]
  }


  const formConfirmLoading = ref(false);

  const formDialog = reactive({
    title: '新增用户',
    top: "15vh",
    width: "880px",
    draggable: true,
    closeOnPressEscape: true,
    confirmLoading: formConfirmLoading,
    cancelText: '取消',
    confirmText: '确定'
  });


  // 用方法每次生成新的对象
  const defualtValue = () => ({
    id: null,
    username: null,
    realname: null,
    password: null,
    gender: null,
    birthday: null,
    email: null,
    phone: null,
    enable: false,
    roleIds: [],
    organizationIds: []
  });

  // 新增、编辑表单
  const formRef = ref();
  const formVisible = ref(false);
  const formValues = ref<FieldValues>(defualtValue());

  const formOpen = (row: any = {}) => {
    formVisible.value = true;
    resetFormRef(formRef);
    if (row.id) {
      formDialog.title = "编辑用户";
      formValues.value = cloneDeep(row);
      // formValues.value = { ...row };
      formValues.value.gender = row.gender.id;
      if (row.roles) {
        formValues.value.roleIds = row.roles.map(role => {
          return role.id;
        });
      }
      if (row.organizations) {
        formValues.value.organizationIds = row.organizations.map(org => {
          return org.id;
        });
      }
    } else {
      formDialog.title = "新增用户";
      formValues.value = defualtValue();
    }
  };

  const formSubmit = async (values: FieldValues): Promise<boolean> => {
    formConfirmLoading.value = true;
    try {
      if (values.id) {
        const res = await updateUserApi(values);
        if (!res?.success) {
          message(res.message, { type: "error" });
          return false;
        }
        formVisible.value = false;
        message(res.message, { type: "success" });
        return true;
      } else {
        const data = await addUserApi(values);
        if (data?.success) {
          formVisible.value = false;
          message(data.message, { type: "success" });
          return true;
        }
        message(data.message, { type: "error" });
        return false;
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        message(`${error.response.data.message}`, { type: "error" });
      } else if (error?.message) {
        message(`${error.message}`, { type: "error" });
      }
      return false;
    } finally {
      formConfirmLoading.value = false;
    }
  };


  return {
    formColumns,
    formRules,
    formConfirmLoading,
    formDialog,
    formRef,
    formVisible,
    formValues,
    formOpen,
    formSubmit
  };
}
