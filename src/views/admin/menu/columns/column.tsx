import { h, ref } from "vue"
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessageBox, ElMessage } from "element-plus";
import { hasAuth } from "@/router/utils";

export function useTable({ menuEnable }) {
  const select = ref("no");
  const hasEnable = !hasAuth("menu:btn:enable");

  const columns: TableColumnList = [
    {
      label: "勾选",
      type: "selection",
      align: "left",
      reserveSelection: true,
      hide: () => (select.value === "no" ? true : false)
    },
    {
      label: "菜单Id",
      prop: "id",
      minWidth: 250
    },
    {
      label: "菜单名称",
      prop: "name",
      minWidth: 160,
      cellRenderer: ({ row }) => {
        if (row.icon) {
          return (
            <>
              <span class="inline-block mr-1">
                {h(useRenderIcon(row.icon), {
                  style: { paddingTop: "2px" }
                })}
              </span>
              <span>{row.name}</span>
            </>
          )
        }
        return <span>{row.name}</span>
      }
    },
    {
      label: "路由名称",
      prop: "routerName",
      width: 120
    },
    {
      label: "路由路径",
      prop: "routerPath",
      minWidth: 160
    },
    {
      label: "路由组件",
      prop: "routerComponent",
      minWidth: 180
    },
    {
      label: "方法",
      prop: "method",
      width: 90,
    },
    {
      label: "接口地址",
      prop: "url",
      minWidth: 180,
    },
    {
      label: "类型",
      prop: "type",
      width: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getMenuType(row.type)}
          effect="light"
        >
          {getMenuType(row.type, true)}
        </el-tag>
      )
    },
    {
      label: "排序",
      prop: "sort",
      width: 70
    },
    {
      label: "权限标识",
      prop: "authKey",
      minWidth: 180
    },
    {
      label: "是否启用",
      prop: "enable",
      width: 100,
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
              menuEnable(row.id, value);
            }}
          />
        );
      }
    },

    {
      label: "创建时间",
      prop: "createTime",
      width: 170
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
      width: 170
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
      width: 160,
      align: "left",
      slot: "operation"
    }
  ];


  const getMenuType = (type, text = false) => {
    if (type) {
      if (text) {
        return type?.name
      }
      switch (type.id) {
        case "Catalog":
          return "primary";
        case "Menu":
          return "warning";
        case "Function":
          return "success";
      }
    }
  };
  return { columns };
};

