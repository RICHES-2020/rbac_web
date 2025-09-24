import { ref, toRaw, reactive, onMounted, watch, Ref, nextTick } from "vue";
import { delay, getKeyList, deviceDetection } from "@pureadmin/utils";
import { message } from "@/utils/message"
import { handleTree } from "@/utils/tree";

import { roleAllApi, deleteRoleApi, updateEnableApi, configRoleMenuApi } from "@/api/admin/role"
import { menuTreeApi, menuWithRoleApi } from "@/api/admin/menu"

export function useRole(treeRef: Ref) {
    const dataList = ref([]);
    const loading = ref(true);

    type RoleFormType = {
        name: string;
        immutable: string;
        remark: string;
        enable: any;
    }

    const searchForm = reactive<RoleFormType>({
        name: null,
        immutable: null,
        remark: null,
        enable: null
    });

    async function onSearch(params = {}) {
        loading.value = true;
        try {
            const result = await roleAllApi(toRaw({
                ...params,
                ...searchForm
            }));
            if (result.success) {
                dataList.value = result.data;
            } else {
                message(result.message, { type: "error" })
            }
        } catch (error) {
            if (error?.response?.data?.message) {
                message(`${error.response.data.message}`, { type: "error" });
            } else if (error?.message) {
                message(`${error.message}`, { type: "error" });
            }
        } finally {
            loading.value = false;
        }
    };

    const sortColumn = ref({
        prop: "updateTime",
        order: "descending"
    });

    const roleDelete = (row) => {
        const commonResult: Promise<CommonResult<void>> = deleteRoleApi(row.id);
        commonResult.then(data => {
            if (data.success) {
                message(`${data.message}`, { type: "success" })
                onSearch();
            } else {
                message(`${data?.message}`, { type: "error" })
            }
        }).catch(error => {
            if (error.response?.data?.message) {
                message(`${error.response.data.message}`, { type: "error" })
            } else if (error.message) {
                message(`${error.message}`, { type: "error" })
            }
        });
    }

    const roleEnable = async (id: string, enable: boolean) => {
        const result = updateEnableApi(id, enable);
        result.then(data => {
            if (data.success) {
                message(`${data.message}`, { type: "success" })
            } else {
                message(`${data?.message}`, { type: "error" })
            }
            onSearch();
        }).catch(error => {
            if (error.response?.data?.message) {
                message(`${error.response.data.message}`, { type: "error" })
            } else if (error.message) {
                message(`${error.message}`, { type: "error" })
            }
            onSearch();
        });
    }

    const curRow = ref();
    const treeIds = ref([]);
    const treeData = ref([]);
    // 菜单赋权区域是否显示
    const isShow = ref(false);
    const isLinkage = ref(true);
    const treeSearchValue = ref();
    const isExpandAll = ref(false);
    const isSelectAll = ref(false);

    // 修复 treeProps 配置 - 根据实际数据结构调整
    const treeProps = {
        value: "id",
        label: "name", // 如果数据中字段是 title，则改为 "title"
        children: "children"
    };

    /** 关闭权限菜单 */
    function closeMenu() {
        curRow.value = null;
        isShow.value = false;
    }

    /** 菜单权限 */
    async function handleMenu(row?: any) {
        const { id } = row;
        if (id) {
            curRow.value = row;
            isShow.value = true;
            // 等待 DOM 更新后再设置选中状态
            await nextTick();
            try {
                const { data } = await menuWithRoleApi(id);
                const menuIds = data.map(item => item.id);
                let isLinkaged = isLinkage.value;
                if (isLinkaged) {
                    isLinkage.value = false;
                }
                if (treeRef.value) {
                    treeRef.value.setCheckedKeys(menuIds);
                    treeRef.value.setExpandedKeys(menuIds);
                }
                if (isLinkaged) {
                    delay(100).then(() => {
                        isLinkage.value = true;
                    });
                }
            } catch (error) {
                console.error("查询角色菜单权限失败:", error);
            }
        } else {
            curRow.value = null;
            isShow.value = false;
            console.error("找不到角色Id");
        }
    }

    /** 高亮当前权限选中行 */
    function rowStyle({ row: { id } }) {
        return {
            cursor: "pointer",
            background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
        };
    }

    /** 菜单权限-保存 */
    function handleSave() {
        const { id, name } = curRow.value;
        const checkedKeys = treeRef.value.getCheckedKeys();
        const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
        const result = configRoleMenuApi(id, [...checkedKeys, ...halfCheckedKeys]);
        result.then(data => {
            if (data.success) {
                isShow.value = false;
                message(`${data.message}`, { type: "success" })
            } else {
                message(`${data?.message}`, { type: "error" })
            }
        }).catch(error => {
            if (error.response?.data?.message) {
                message(`${error.response.data.message}`, { type: "error" })
            } else if (error.message) {
                message(`${error.message}`, { type: "error" })
            }
        });
        // 根据用户 id 调用实际项目中菜单权限修改接口
        // console.log(id, treeRef.value.getCheckedKeys());
        // message(`角色名称为${name}的菜单权限修改成功`, {
        //     type: "success"
        // });
    }

    const onQueryChanged = (query: string) => {
        if (treeRef.value) {
            treeRef.value.filter(query);
        }
    };

    // 修复 filterMethod 字段名
    const filterMethod = (query: string, node) => {
        return node.name && node.name.includes(query);
    };

    onMounted(async () => {
        onSearch();
        try {
            const { data } = await menuTreeApi({ enable: true });
            treeData.value = data;
            // getKeyList 没有递归获取树的所有节点，所以只能展开1层
            treeIds.value = getKeyList(data, "id");
            // treeData.value = handleTree(data);
        } catch (error) {
            console.error("获取菜单树失败:", error);
        }
    });

    watch(isExpandAll, val => {
        if (treeRef.value) {
            val
                ? treeRef.value.setExpandedKeys(treeIds.value)
                : treeRef.value.setExpandedKeys([]);
        }
    });

    watch(isSelectAll, val => {
        if (treeRef.value) {
            val
                ? treeRef.value.setCheckedKeys(treeIds.value)
                : treeRef.value.setCheckedKeys([]);
        }
    });

    return {
        dataList,
        loading,
        searchForm,
        sortColumn,
        onSearch,
        roleDelete,
        roleEnable,

        curRow,
        treeData,
        treeProps,
        isShow,
        isLinkage,
        treeSearchValue,
        isExpandAll,
        isSelectAll,

        closeMenu,
        handleMenu,
        handleSave,
        filterMethod,
        onQueryChanged,
        rowStyle,
    };
}