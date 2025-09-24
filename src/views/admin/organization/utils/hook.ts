import { ref, toRaw, reactive, onMounted, Ref } from "vue";

import { message } from "@/utils/message"
import { type TreeNode, filterTree } from "@/utils/open"

import { 
    organizationTreeApi, 
    deleteOrganizationApi, 
    updateEnableApi 
} from "@/api/admin/organization"


export function useOrganization() {

    const dataList = ref([]);
    const loading = ref(true);
    const higherOrganizations = ref([])

    type OrganizationFormType = {
        name: string;
        code: string;
        enable: any;
    }

    const searchForm = reactive<OrganizationFormType>({
        name: null,
        code: null,
        enable: null
    });

    async function onSearch(params = {}) {
        loading.value = true;
        try {
            const result = await organizationTreeApi(toRaw({
                ...params,
                ...searchForm
            }));
            if (result.success) {
                dataList.value = result.data;
                // 递归处理树状机构
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

    const loopLookup = async (data: TreeNode[]) => {
        const newOrganizations = filterTree(data, () => true);
        higherOrganizations.value = newOrganizations;
    }

    const organizationDelete = (row) => {
        const commonResult: Promise<CommonResult<void>> = deleteOrganizationApi(row.id);
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

    const organizationEnable = async (id: string, enable: boolean) => {
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
        organizationDelete,
        organizationEnable,
        higherOrganizations
    };

}