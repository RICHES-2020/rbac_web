import { ref, computed, reactive } from "vue";
import type { PlusColumn, FieldValues } from "plus-pro-components";

import { message } from "@/utils/message"
import { resetFormRef } from "@/utils/open"
import { getIdApi, getNameApi, addRoleApi, updateRoleApi } from "@/api/admin/role"

export function useForm() {

  const isAddAction = ref(true);

  const formColumns: PlusColumn[] = [
    {
      label: "角色Id",
      prop: "id",
      valueType: "input",
      tooltip: "角色Id长度为4~32个字符",
      fieldProps: computed(() => ({
        placeholder: "请输入角色Id",
        disabled: !isAddAction.value
      })),
      formItemProps: {
        size: "default"
      },
      rules: [
        {
          async validator(_rule, value, callback) {
            if (!value) return callback();
            // 本地格式不通过时不发请求
            if (!/^[a-zA-Z0-9-]{4,32}$/.test(value)) return callback();
            try {
              const res = await getIdApi(value);
              if (res?.success && res.data != null) {
                callback(new Error("角色Id已存在"));
              } else {
                callback();
              }
            } catch (e: any) {
              callback(new Error(e?.response?.data?.message || "校验失败"));
            }
          },
          trigger: ["blur"]
        }
      ]
    },
    {
      label: "角色名称",
      prop: "name",
      fieldProps: {
        size: "default",
        placeholder: "请输入角色名称"
      },
      rules: [
        {
          async validator(_rule, value, callback) {
            if (!value) return callback();
            if (!/^[\u4e00-\u9fa5a-zA-Z0-9-]{4,32}$/.test(value)) return callback();
            try {
              const res = await getNameApi(formValues.value?.id as string, value);
              if (res?.success && res.data != null) {
                callback(new Error("角色名称已存在"));
              } else {
                callback();
              }
            } catch (e: any) {
              callback(new Error(e?.response?.data?.message || "校验失败"));
            }
          },
          trigger: ["blur"]
        }
      ]
    },
    {
      label: "是否启用",
      prop: "enable",
      valueType: "switch",
      fieldProps: {
        placeholder: "是否启用",
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
        placeholder: "说明"
      }
    }
  ];


  const formRules = {
    id: [
      { required: true, message: "请输入角色Id", trigger: "blur" },
      {
        pattern: /^[a-zA-Z0-9-]{4,32}$/,
        message: "4~32位的英文字符、数字、减号",
        trigger: ["change"]
      }
    ],
    name: [
      { required: true, message: "请输入角色名称", trigger: "blur" },
      {
        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9-]{4,32}$/,
        message: "4~32位的中文、英文字符、数字、减号",
        trigger: ["change"]
      }
    ]
  }


  const formConfirmLoading = ref(false);

  const formDialog = reactive({
    title: '新增角色',
    top: "15vh",
    width: "660px",
    draggable: true,
    closeOnPressEscape: true,
    confirmLoading: formConfirmLoading,
    cancelText: '取消',
    confirmText: '确定'
  });


  // 每次生成新的对象
  const defualtValue = () => ({
    id: null,
    name: "",
    enable: false,
    remark: ""
  });

  const formRef = ref();
  const formVisible = ref(false);
  const formValues = ref<FieldValues>(defualtValue());

  const formOpen = (row: any = {}) => {
    resetFormRef(formRef);
    formVisible.value = true;
    if (isAddAction.value) {
      formDialog.title = "新增角色";
      formValues.value = defualtValue();
    } else {
      formDialog.title = "编辑角色";
      formValues.value = { ...row };
    }
  };

  const formSubmit = async (values: FieldValues): Promise<boolean> => {
    formConfirmLoading.value = true;
    try {
      if (isAddAction.value) {
        const data = await addRoleApi(values);
        if (data?.success) {
          formVisible.value = false;
          return true;
        }
        message(data.message, { type: "error" });
        return false;
      } else {
        const res = await updateRoleApi(values);
        if (!res?.success) {
          message(res.message, { type: "error" });
          return false;
        }
        formVisible.value = false;
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
      formConfirmLoading.value = false;
    }
  };

  return {
    formColumns,
    formRules,
    formConfirmLoading,
    formDialog,
    formVisible,
    formRef,
    formValues,
    formOpen,
    formSubmit,
    isAddAction
  };
}
