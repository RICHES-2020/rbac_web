import { ref, computed, reactive, Ref } from "vue";
import type { PlusColumn, FieldValues } from "plus-pro-components";

import { message } from "@/utils/message"
import { resetFormRef } from "@/utils/open"
import {
  getCodeApi,
  getNameApi,
  addOrganizationApi,
  updateOrganizationApi
} from "@/api/admin/organization"

export function useForm(higherOrganizations: Ref) {

  const formColumns: PlusColumn[] = [
    {
      label: "父级机构",
      prop: "parentId",
      valueType: "cascader",
      fieldProps: {
        placeholder: "请选择父级机构",
        clearable: true,
        style: { width: "100%" },
        props: {
          checkStrictly: true, // 允许选择任意级别
          emitPath: false, // 只返回选中节点的值，不返回完整路径
          value: 'id', // 指定 value 字段
          label: 'name', // 指定 label 字段
          children: 'children' // 指定 children 字段
        }
      },
      options: computed(() => higherOrganizations.value || []),
    },
    {
      label: "机构编码",
      prop: "code",
      valueType: "input",
      fieldProps: computed(() => ({
        placeholder: "请输入机构编码"
      })),
      formItemProps: {
        size: "large"
      },
      rules: [
        { required: true, message: "请输入组织机构编码", trigger: "blur" },
        {
          async validator(_rule, value, callback) {
            if (!value) return callback();
            // 格式校验不通过则不发送请求
            if (!/^[a-zA-Z0-9_]{2,32}$/.test(value)) return callback();
            try {
              const res = await getCodeApi(value);
              if (res?.success && res.data != null) {
                callback(new Error("组织机构编码已存在"));
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
      label: "机构名称",
      prop: "name",
      fieldProps: {
        size: "default",
        placeholder: "请输入组织机构名称"
      },
      rules: [
        {
          async validator(_rule, value, callback) {
            if (!value) return callback();
            try {
              const res = await getNameApi(formValues.value?.id, formValues.value?.parentId || "0", value);
              if (res?.success && res.data != null) {
                callback(new Error("组织机构名称已存在"));
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
      label: '排序',
      prop: 'sort',
      valueType: 'input-number',
      fieldProps: {
        placeholder: "请输入序号",
        min: 1,        // 设置最小值，确保为正数
        max: 10000,    // 设置最大值
        precision: 0,  // 设置精度为0，确保为整数
        step: 1,       // 设置步长为1，便于整数调整
        // 注意: 部分UI库的precision精度属性设置为0可以限制输入整数:cite[3]:cite[6]:cite[9]
        controls: true, // 确保显示控制按钮（可选）
        style: { width: "90%" }
      },
      rules: [{ required: true, message: "请输入序号", trigger: "blur" }]
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
      { required: true, message: "请输入组织机构编码", trigger: "blur" },
      {
        pattern: /^[a-zA-Z0-9_]{2,32}$/,
        message: "2~32位的英文字符、数字、下划线",
        trigger: ["change"]
      }
    ],
    name: [
      { required: true, message: "请输入组织机构名称", trigger: "blur" }
    ]
  }

  const formConfirmLoading = ref(false);
  const formDialog = reactive({
    title: '新增组织机构',
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
    code: "",
    name: "",
    sort: 10,
    enable: false,
    remark: ""
  });

  const formRef = ref();
  const formVisible = ref(false);
  const formValues = ref<FieldValues>(defualtValue());

  const formOpen = (row: any = {}) => {
    resetFormRef(formRef);
    formVisible.value = true;
    if (row.id) {
      formDialog.title = "编辑组织机构";
      formValues.value = { ...row };
    } else {
      formDialog.title = "新增组织机构";
      formValues.value = defualtValue();
    }
  };

  const formSubmit = async (values: FieldValues): Promise<boolean> => {
    formConfirmLoading.value = true;
    try {
      if (formValues.value.id) {
        const data = await updateOrganizationApi(values);
        if (data?.success) {
          formVisible.value = false;
          return true;
        }
        message(data.message, { type: "error" });
        return false;
      } else {
        const data = await addOrganizationApi(values);
        if (data?.success) {
          formVisible.value = false;
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
    formVisible,
    formRef,
    formValues,
    formOpen,
    formSubmit
  };
}
