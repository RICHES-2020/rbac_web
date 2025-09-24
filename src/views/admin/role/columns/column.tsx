import { ref } from "vue"
import { ElMessageBox, ElMessage } from "element-plus";
import { hasAuth } from "@/router/utils";
import "@/style/box.css"

export function useTable({ roleEnable }) {
  const select = ref("yes");
  const hideValue = ref("nohide");
  const hasEnable = !hasAuth("role:btn:enable");

  const columns: TableColumnList = [
    {
      label: "勾选",
      type: "selection",
      align: "left",
      reserveSelection: true,
      hide: () => (select.value === "no" ? true : false)
    },
    {
      label: "角色ID",
      prop: "id",
      minWidth: 160,
      hide: () => (hideValue.value === "hideId" ? true : false)
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 160,
      hide: () => (hideValue.value === "hideName" ? true : false)
    },
    {
      label: "系统内置",
      prop: "immutable",
      width: 120,
      hide: () => (hideValue.value === "hideGender" ? true : false),
      cellRenderer: ({ row }) => {
        return (<span>{row.immutable?.id === "Y" ? "是" : "否"}</span>);
      }
    },
    {
      label: "是否启用",
      prop: "enable",
      width: 120,
      hide: () => (hideValue.value === "hideEnable" ? true : false),
      cellRenderer: ({ row }) => {
        return (
          <el-switch
            disabled={hasEnable}
            v-model={row.enable}
            class="ml-2"
            inlinePrompt
            activeText="是"
            inactiveText="否"
            activeValue={true}
            inactiveValue={false}
            style={{
              "--el-switch-on-color": "#13ce66",
              "--el-switch-off-color": "#ff4949"
            }}
            beforeChange={() => {
              const next = !row.enable;
              return ElMessageBox.confirm(
                `确定要${next ? "启用" : "禁用"}（${row.name}）吗？`,
                "提示",
                {
                  type: "warning",
                  customClass: 'custom-box-top'
                }
              )
                .then(() => true)
                .catch(() => false);
            }}
            onChange={(value: boolean) => {
              roleEnable(row.id, value);
            }}
          />
        );
      }
    },
    {
      label: "备注",
      prop: "remark",
      width: 180,
      hide: () => (hideValue.value === "hideBirthday" ? true : false)
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 170,
      hide: () => (hideValue.value === "hideCreateTime" ? true : false)
    },
    {
      label: "创建人",
      prop: "createBy",
      width: 100,
      hide: () => (hideValue.value === "hideCreateBy" ? true : false),
      cellRenderer: ({ row, props }) => {
        if (row.createBy && row.createBy != '0') {
          return row.createBy;
        }
        return (<span> 系统 </span>);
      }
    },
    {
      label: "更新时间",
      prop: "updateTime",
      width: 170,
      hide: () => (hideValue.value === "hideUpdateTime" ? true : false)
    },
    {
      label: "更新人",
      prop: "updateBy",
      width: 100,
      hide: () => (hideValue.value === "hideUpdateBy" ? true : false),
      cellRenderer: ({ row, props }) => {
        if (row.updateBy && row.updateBy != '0') {
          return row.updateBy;
        }
        return (<span> 系统 </span>);
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 208,
      align: "left",
      slot: "operation"
    }
  ];

  return { columns };
};

