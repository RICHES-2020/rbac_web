import { ref, toRaw, reactive, computed, onMounted, Ref } from "vue";
import { useDark, deviceDetection, getKeyList } from "@pureadmin/utils"

import { message } from "@/utils/message"
import { type TreeNode, filterTree } from "@/utils/open"

import { menuTreeApi, updateEnableApi, deleteMenuApi } from "@/api/admin/menu"


export function useMenu() {

    const dataList = ref([]);

    const loading = ref(true);

    const higherMenus = ref([]);

    async function onSearch(params = {}) {
        loading.value = true;
        try {
            const result = await menuTreeApi(toRaw({
                ...params,
                ...searchForm
            }));
            if (result.success) {
                dataList.value = result.data;

                // 递归处理树状菜单转化为父级菜单供选择
                loopLookup(dataList.value);
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


    // ---------- 递归过滤树状菜单 ----------
    const loopLookup = async (data: TreeNode[]) => {
        const newMenus = filterTree(data, node => node.type.id !== "Function");
        higherMenus.value = newMenus;
    }
    // ---------- 递归过滤树状菜单 ----------

    type MenuFormType = {
        name: string;
        authKey: string;
        enable: boolean;
    }

    const searchForm = reactive<MenuFormType>({
        name: null,
        authKey: null,
        enable: null,
    });

    const menuDelete = (row) => {
        const commonResult: Promise<CommonResult<void>> = deleteMenuApi(row.id);
        commonResult.then(data => {
            if (data.success) {
                message(`${data.message}`, { type: "success" })
                onSearch();
            } else {
                message(`${data?.message}`, { type: "error" })
            }
        }).catch(error => {
            if (error.response?.data?.message) {
                message(`${error.response?.data?.message}`, { type: "error" })
            } else if (error.message) {
                message(`${error.message}`, { type: "error" })
            }
        });
    }


    const menuEnable = async (id: string, enable: boolean) => {
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
                message(`${error.response?.data?.message}`, { type: "error" })
            } else if (error.message) {
                message(`${error.message}`, { type: "error" })
            }
            onSearch();
        });
    }

    onMounted(() => {
        onSearch();
    });

    return {
        dataList,
        loading,
        searchForm,
        onSearch,
        menuDelete,
        menuEnable,
        higherMenus
    };

}