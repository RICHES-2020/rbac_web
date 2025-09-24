import { h, ref, toRaw, reactive, computed, onMounted, Ref } from "vue";
import { ElMessageBox } from "element-plus"
import { PaginationProps, LoadingConfig } from "@pureadmin/table"
import { getKeyList, deviceDetection } from "@pureadmin/utils";

import { addDialog } from "@/components/ReDialog";
import ReCropperPreview from "@/components/ReCropperPreview";
import defaultAvatar from "@/assets/user.jpg";

import { message } from "@/utils/message"
import { UserResponseType, userPageApi, updateEnableApi, deleteUserApi, updateAvatarApi } from "@/api/admin/user"
import { organizationTreeApi } from "@/api/admin/organization"
import { roleAllApi } from "@/api/admin/role"
import { paramConvertor, sortConvertor } from "@/utils/search";


export function useUser(tableRef: Ref) {

    const dataList = ref([]);

    const paginationProps = reactive<PaginationProps>({
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50],
        currentPage: 1,
        background: true,
        size: "default",
        align: "right"
    });


    const loading = ref(true);

    /** 加载动画配置 */
    const loadingConfig = reactive<LoadingConfig>({
        text: "正在加载...",
        viewBox: "-10, -10, 50, 50",
        spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
        // svg: "",
        // background: rgba()
    });

    async function userPage(params) {
        return new Promise<CommonResult<PageDataType<UserResponseType>>>((resolve, reject) => {
            userPageApi(params)
                .then(data => {
                    if (data?.success) {
                        const pageData: PageDataType<UserResponseType> = { ...data.data };
                        dataList.value = pageData.content;
                    }
                    resolve(data);
                })
                .catch(error => {
                    if (error.response?.data) {
                        resolve(error.response.data);
                    } else {
                        reject(error);
                    }
                    if (error.response?.data?.message) {
                        message(`${error.response?.data?.message}`, { type: "error" })
                    } else if (error.message) {
                        message(`${error.message}`, { type: "error" })
                    }
                });
        });
    };


    type UserFormType = {
        username: string;
        phone: string;
        gender: string;
        enable: any;
    }

    const searchForm = reactive<UserFormType>({
        username: "",
        phone: "",
        gender: "",
        enable: ""
    });

    const organizationId = ref("");

    const sortColumn = ref({
        prop: "updateTime",
        order: "descending"
    });

    const fiterFields = ["gender", "enable"];

    async function onSearch(params = {}) {
        loading.value = true;
        let enable = searchForm.enable;
        if (enable) {
            // delete searchForm.enable;
            // 转为后端Boolean类型
            searchForm.enable = enable === "true";
        }
        // 表单参数转为查询参数
        const searchParams = paramConvertor(searchForm, fiterFields);
        searchForm.enable = enable;

        const sortBys = sortConvertor(sortColumn.value);
        try {
            const res = await userPage(toRaw({
                ...searchParams,
                ...params,
                organizationId: organizationId?.value || null,
                page: paginationProps.currentPage,
                size: paginationProps.pageSize,
                sortBys
            }));
            if (res?.success) {
                dataList.value = res?.data?.content || [];
                paginationProps.total = res?.data.totalElements;
            }
        } catch (e) {
            if (e.response?.data?.message) {
                message(`${e.response?.data?.message}`, { type: "error" })
            } else if (e.message) {
                message(`${e.message}`, { type: "error" })
            }
        } finally {
            loading.value = false;
        }
    };


    const userDelete = (row) => {
        const commonResult: Promise<CommonResult<void>> = deleteUserApi(row.id);
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


    const userEnable = async (id: string, enable: boolean) => {
        const result = updateEnableApi(enable, [ id ]);
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


    const selectedNum = ref(0)

    /** 当CheckBox选择项发生变化时会触发该事件 */
    function onSelectionChange(val) {
        selectedNum.value = val.length;
        // 重置表格高度
        tableRef.value.setAdaptive();
    }

    /** 取消选择 */
    function onSelectionCancel() {
        selectedNum.value = 0;
        // 用于多选表格，清空用户的选择
        tableRef.value.getTableRef().clearSelection();
    }

    /** 批量删除 */
    function onBatchDel() {
        // 返回当前选中的行
        const selectedRows = tableRef.value.getTableRef().getSelectionRows();

        if (selectedRows.length === 0) {
            message("请选择条目", { type: "warning" })
            return;
        }
        // 构建选中数据的提示信息
        const selectedInfo = selectedRows.map(row => `${row.username || row.realname || '未知用户'}`).join('、');

        // 使用 ElMessageBox 进行二次确认
        ElMessageBox.confirm(
            `您已选择以下 ${selectedRows.length} 个用户：\n${selectedInfo}\n\n确认要删除这些用户吗？删除后不可恢复！`,
            "批量删除",
            {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
                draggable: true,
                dangerouslyUseHTMLString: false,
                customClass: 'custom-box-top'
            }
        ).then(() => {
            // const ids = getKeyList(selectedRows, "id");

            // 用户确认删除
            // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
            message(`已删除用户为 ${getKeyList(selectedRows, "username")} 的数据`, {
                type: "success"
            });
            tableRef.value.getTableRef().clearSelection();
            onSearch();
        }).catch(() => {
            // 用户取消删除，不做任何操作
            message('已取消删除操作', { type: 'info' });
        });
    }


    const treeData = ref([]);
    const treeLoading = ref(true);
    const roleOptions = ref([]);

    // 选择树节点时
    function onTreeSelect({ id, selected }) {
        organizationId.value = selected ? id : "";
        paginationProps.currentPage = 1;
        paginationProps.pageSize = 10;
        onSearch();
    }

    const cutAvatar = ref();
    const cropRef = ref();
    /** 上传头像 */
    function handleUpload(row) {
        addDialog({
            title: "裁剪、上传头像",
            top: "15vh",
            width: "880px",
            draggable: true,
            closeOnPressEscape: true,
            closeOnClickModal: false,
            fullscreen: deviceDetection(),
            contentRenderer: () =>
                h(ReCropperPreview, {
                    ref: cropRef,
                    maxSize: 2, // 2mb
                    imgSrc: row.avatar || defaultAvatar,
                    onCropper: base64 => (cutAvatar.value = base64)
                }),
            beforeSure: done => {
                // console.log("裁剪后的图片信息：", cutAvatar.value);
                // 根据实际业务使用avatarInfo.value和row里的某些字段去调用上传头像接口即可
                updateAvatarApi({ id: row.id, avatar: cutAvatar.value.base64 }).then(data => {
                    if (data?.success) {
                        message(data.message, { type: "success" });
                        done(); // 关闭弹框
                        onSearch(); // 刷新表格数据
                    } else {
                        message(data.message, { type: "error" });
                    }
                }).catch(err => {
                    if (err?.response?.data?.message) {
                        message(`${err.response.data.message}`, { type: "error" });
                    } else if (err?.message) {
                        message(`${err.message}`, { type: "error" });
                    }
                });
            },
            closeCallBack: () => { }
        });
    }


    onMounted(async () => {
        treeLoading.value = true;
        onSearch();
        // 归属部门
        const { data } = await organizationTreeApi({ enable: true });
        treeData.value = data;
        treeLoading.value = false;
        // 角色列表
        const roleList = (await roleAllApi({ enable: true })).data;
        roleOptions.value = roleList.map(role => {
            return { label: role.name, value: role.id };
        });
    });

    return {
        dataList,
        loading,
        loadingConfig,
        paginationProps,
        searchForm,
        sortColumn,
        onSearch,
        userDelete,
        userEnable,
        selectedNum,
        onSelectionChange,
        onSelectionCancel,
        onBatchDel,
        roleOptions,
        deviceDetection,
        treeData,
        treeLoading,
        onTreeSelect,
        handleUpload
    };

}