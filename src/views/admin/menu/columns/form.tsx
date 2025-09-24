import { ref, computed, reactive, Ref } from "vue";

import type { PlusColumn, FieldValues } from "plus-pro-components";
import { cloneDeep } from "@pureadmin/utils";
import { message } from "@/utils/message"
import { resetFormRef } from "@/utils/open"
import { getIdApi, getNameApi, addMenuApi, updateMenuApi } from "@/api/admin/menu"
import { menuTypeOptions, menuMethodOptions } from "../utils/enum";

export function useForm(higherMenus: Ref) {

  const isAddAction = ref(true);

  const formColumns: PlusColumn[] = [
    {
      label: "菜单Id",
      prop: "id",
      valueType: "input",
      tooltip: "菜单Id长度为4~36个字符",
      fieldProps: computed(() => ({
        placeholder: "请输入角色Id",
        disabled: !isAddAction.value,
        style: { width: "90%" }
      })),
      rules: [
        { required: true, message: "请输入菜单Id", trigger: "blur" },
        {
          async validator(_rule, value, callback) {
            if (!value) return callback();
            if (!/^[a-zA-Z0-9-]{4,36}$/.test(value)) return callback();
            try {
              const res = await getIdApi(value);
              if (res?.success && res.data != null) {
                callback(new Error("菜单Id已存在"));
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
      label: "父级菜单",
      prop: "parentId",
      valueType: "cascader",
      fieldProps: {
        placeholder: "请选择父级菜单",
        clearable: true,
        style: { width: "90%" },
        props: {
          checkStrictly: true, // 允许选择任意级别
          emitPath: false, // 只返回选中节点的值，不返回完整路径
          value: 'id', // 指定 value 字段
          label: 'name', // 指定 label 字段
          children: 'children' // 指定 children 字段
        }
      },
      options: computed(() => higherMenus.value || []),
    },    
    {
      label: "菜单名称",
      prop: "name",
      fieldProps: {
        placeholder: "请输入菜单名称",
        style: { width: "90%" }
      },
      rules: [
        {
          async validator(_rule, value, callback) {
            if (!value) return callback();
            if (!/^[\u4e00-\u9fa5a-zA-Z]{2,32}$/.test(value)) return callback();
            try {
              const res = await getNameApi(formValues.value?.id, formValues.value?.parentId || "0", value);
              if (res?.success && res.data != null) {
                callback(new Error("菜单名称已存在"));
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
      label: "菜单类型",
      prop: "type",
      valueType: "select",
      fieldProps: {
        placeholder: "菜单类型",
        clearable: true,
        style: { width: "90%" }
      },
      options: computed(() => menuTypeOptions),
      rules: [{ required: true, message: "请选择菜单类型", trigger: "blur" }]
    },
    {
      label: "路由名称",
      prop: "routerName",
      fieldProps: {
        placeholder: "前端路由名称",
        style: { width: "90%" }
      }
    },
    {
      label: "路由路径",
      prop: "routerPath",
      fieldProps: {
        placeholder: "前端路由路径",
        style: { width: "90%" }
      }
    },
    {
      label: "路由组件",
      prop: "routerComponent",
      fieldProps: {
        placeholder: "前端路由的组件路径：/views/**/*.vue|.tsx",
        style: { width: "90%" }
      }
    },
    {
      label: "权限标识",
      prop: "authKey",
      fieldProps: {
        placeholder: "按钮的权限标识, 比如: user:btn:add",
        style: { width: "90%" }
      }
    },    
    {
      label: "菜单图标",
      prop: "icon",
      fieldProps: {
        placeholder: "iconify图标样式",
        style: { width: "90%" }
      }
    },
    {
      label: "请求方法",
      prop: "method",
      valueType: "select",
      fieldProps: {
        placeholder: "请求方法: GET/POST/PUT/DELETE/PATCH",
        clearable: true,
        style: { width: "90%" }
      },
      options: computed(() => menuMethodOptions)
    },
    {
      label: "菜单请求",
      prop: "url",
      fieldProps: {
        placeholder: "菜单请求Url",
        style: { width: "90%" }
      }
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
        style: { width: "90%" }
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
      }
    }
  ];


  const formRules = {
    id: [
      { required: true, message: "请输入菜单Id", trigger: "blur" },
      {
        pattern: /^[a-zA-Z0-9-]{4,32}$/,
        message: "4~32位的英文字符、数字、减号",
        trigger: ["change"]
      }
    ],
    name: [
      { required: true, message: "请输入菜单名称", trigger: "blur" },
      {
        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9-]{2,32}$/,
        message: "2~32位的中文、英文字符、数字、减号",
        trigger: ["change"]
      }
    ]
  }


  const formConfirmLoading = ref(false);

  const formDialog = reactive({
    title: '新增菜单',
    top: "15vh",
    width: "880px",
    draggable: true,
    closeOnPressEscape: true,
    confirmLoading: formConfirmLoading,
    cancelText: '取消',
    confirmText: '确定'
  });


  // 每次生成新的对象
  const defualtValue = () => ({
    id: null,
    parentId: "0",
    name: null,
    enable: false,
    type: null,
    sort: 1,
    remark: null
  });

  const formRef = ref();
  const formVisible = ref(false);
  const formValues = ref<FieldValues>(defualtValue());

  const formOpen = (row: any = {}) => {
    resetFormRef(formRef);
    formVisible.value = true;
    if (isAddAction.value) {
      formDialog.title = "新增菜单";
      formValues.value = defualtValue();
    } else {
      formDialog.title = "编辑菜单";
      // 建议深拷贝数据
      // formValues.value = {...row};
      formValues.value = cloneDeep(row);
      formValues.value.type = row.type.id
    }
  };

  const formSubmit = async (values: FieldValues): Promise<boolean> => {
    formConfirmLoading.value = true;
    try {
      
      if (isAddAction.value) {
        const data = await addMenuApi(values);
        if (data?.success) {
          formVisible.value = false;
          return true;
        }
        message(data.message, { type: "error" });
        return false;
      } else {
        const res = await updateMenuApi(values);
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
