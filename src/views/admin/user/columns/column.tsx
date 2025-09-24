import { ref } from "vue"
import defalutAvatar from "@/assets/user.jpg";
import { ElMessageBox, ElMessage } from "element-plus";
import { hasAuth } from "@/router/utils";
import { genderTag } from "@/utils/open";

export function useTable(userEnable) {
  const select = ref("yes");
  const hideValue = ref("nohide");
  const hasEnable = !hasAuth("user:btn:enable");

  const columns: TableColumnList = [
    {
      label: "勾选",
      type: "selection",
      align: "left",
      reserveSelection: true,
      hide: () => (select.value === "no" ? true : false)
    },
    {
      label: "头像",
      prop: "avatar",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.avatar || defalutAvatar}
          preview-src-list={Array.of(row.avatar || defalutAvatar)}
          class="w-[24px] h-[24px] rounded-full align-middle"
        />
      ),
      width: 80
    },
    {
      label: "用户名",
      prop: "username",
      sortable: "custom",
      minWidth: 120,
      hide: () => (hideValue.value === "hideUsername" ? true : false)
    },
    {
      label: "姓名",
      prop: "realname",
      sortable: "custom",
      minWidth: 100,
      hide: () => (hideValue.value === "hideRealname" ? true : false)
    },
    {
      label: "性别",
      prop: "gender",
      sortable: "custom",
      width: 90,
      hide: () => (hideValue.value === "hideGender" ? true : false),
      // cellRenderer: ({ row }) => {
      //   return (<span>{row.gender?.name || "-"}</span>);
      // },
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={genderTag(row.gender)}
          effect="light"
        >
          {genderTag(row.gender, true)}
        </el-tag>
      )
    },
    {
      label: "生日",
      prop: "birthday",
      width: 120,
      sortable: "custom",
      hide: () => (hideValue.value === "hideBirthday" ? true : false)
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 180,
      sortable: "custom",
      hide: () => (hideValue.value === "hideEmail" ? true : false),
      cellRenderer: ({ row }) => {
        return <span>{row.showEmail || "-"}</span>;
      }
    },
    {
      label: "手机",
      prop: "phone",
      sortable: "custom",
      minWidth: 120,
      hide: () => (hideValue.value === "hidePhone" ? true : false),
      cellRenderer: ({ row }) => {
        return <span>{row.showPhone || "-"}</span>;
      }
    },
    {
      label: "是否启用",
      prop: "enable",
      sortable: "custom",
      width: 116,
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
                `确定要${next ? "启用" : "禁用"}（${row.username}）吗？`,
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
              userEnable(row.id, value);
            }}
          />
        );
      }
    },
    {
      label: "角色",
      prop: "roleText",
      width: 150,
      hide: () => (hideValue.value === "hideRoleText" ? true : false),
      cellRenderer: ({ row }) => {
        if (row?.roleText) {
          return (<span>{row.roleText}</span>)
        }
        return (<span>-</span>)
      }
    },
    {
      label: "组织机构",
      prop: "organizationText",
      width: 160,
      hide: () => (hideValue.value === "hideOrganizationText" ? true : false),
      cellRenderer: ({ row }) => {
        if (row?.organizationText) {
          return (<span>{row.organizationText}</span>)
        }
        return (<span>-</span>)
      }
    },
    {
      label: "创建时间",
      prop: "createTime",
      sortable: "custom",
      width: 170,
      hide: () => (hideValue.value === "hideCreateTime" ? true : false)
    },
    {
      label: "创建人",
      prop: "createBy",
      sortable: "custom",
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
      sortable: "custom",
      width: 170,
      hide: () => (hideValue.value === "hideUpdateTime" ? true : false)
    },
    {
      label: "更新人",
      prop: "updateBy",
      sortable: "custom",
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
      width: 178,
      align: "left",
      slot: "operation"
    }
  ];

  return { columns };
};

