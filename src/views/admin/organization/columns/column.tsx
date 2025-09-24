import { ElMessageBox, ElMessage } from "element-plus";
import { hasAuth } from "@/router/utils";

export function useTable({ organizationEnable }) {

  const hasEnable = !hasAuth("organization:btn:enable");

  const columns: TableColumnList = [
    {
      label: "勾选",
      type: "selection",
      align: "left",
      reserveSelection: true,
    },
    {
      label: "机构名称",
      prop: "name",
      minWidth: 160,
    },
    {
      label: "机构编码",
      prop: "code",
      minWidth: 160,
    },
    {
      label: "排序",
      prop: "sort",
      width: 70
    },
    {
      label: "是否启用",
      prop: "enable",
      width: 120,
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
                  customClass: 'custom-box-top',
                }
              )
                .then(() => true)
                .catch(() => false);
            }}
            onChange={(value: boolean) => {
              organizationEnable(row.id, value);
            }}
          />
        );
      }
    },

    {
      label: "备注",
      prop: "remark",
      width: 180,
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 170,
    },
    {
      label: "创建人",
      prop: "createBy",
      width: 100,
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
    },
    {
      label: "更新人",
      prop: "updateBy",
      width: 100,
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
      width: 180,
      align: "left",
      slot: "operation"
    }
  ];
  return { columns };
};

