<script setup lang="ts">
import { ref, computed } from "vue"
import { delay } from "@pureadmin/utils"
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { ElButton, ElPopconfirm, ElMessageBox } from "element-plus";
import { PlusDialogForm } from "plus-pro-components";

import "@/style/box.css"
import { useUser } from "./utils/hook"
import { useTable } from "./columns/column"
import { useForm } from "./columns/form"
import { useConfigForm } from "./columns/configForm"

import { genderOptions } from "./utils/enum"
import tree from "./tree.vue";
import More from "~icons/ep/more-filled";

defineOptions({
    name: "User"
})

// 搜索表单
const searchFormRef = ref();
const tableRef = ref();

const {
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

} = useUser(tableRef);


const {
    formColumns,
    formRules,
    formDialog,
    formRef, // 新增、编辑表单
    formVisible,
    formValues,
    formOpen,
    formSubmit
} = useForm(roleOptions, treeData);

const { columns } = useTable(userEnable);
// const searchColumns = useSearch();

const handleRefresh = () => {
    onSearch();
};

const handleFullscreen = () => {
    // 重置表格高度
    tableRef.value.setAdaptive();
};


const onSortChange = (column: any) => {
    sortColumn.value = column;
    paginationProps.currentPage = 1;
    onSearch();
};

const headerCellStyle = {
    background: "var(--el-fill-color-light)",
    color: "var(--el-text-color-primary)"
};


const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    paginationProps.currentPage = 1;
    onSearch();
};

function onSizeChange(val) {
    paginationProps.pageSize = val;
    onSearch();
}

function onCurrentChange(val) {
    //loadingConfig.text = `正在加载第${val}页...`;
    loadingConfig.text = "正在加载...";
    loading.value = true;
    paginationProps.currentPage = val;
    delay(600).then(() => {
        loading.value = false;
    });
    onSearch();
}


const handleFormConfirm = async (values) => {
    const isOk = await formSubmit(values);
    if (isOk) {
        onSearch();
    }
}


const buttonClass = computed(() => {
    return [
      "h-[20px]!",
      "reset-margin",
      "text-gray-500!",
      "dark:text-white!",
      "dark:hover:text-primary!"
    ];
  });




// 重设密码、设置角色、设置组织机构等
const {
    passwordFormColumns,
    passwordFormRules,
    passwordFormDialog,
    passwordFormRef,
    passwordFormVisible,
    passwordFormValues,
    passwordFormOpen,
    passwordFormSubmit,

    resetPasswordFormColumns,
    resetPasswordFormDialog,
    resetPasswordFormRef,
    resetPasswordFormVisible,
    resetPasswordFormValues,
    resetPasswordFormOpen,
    resetPasswordFormSubmit,

    updateRoleRelFormColumns,
    updateRoleRelFormDialog,
    updateRoleRelFormRef,
    updateRoleRelFormVisible,
    updateRoleRelFormValues,
    updateRoleRelFormOpen,
    updateRoleRelFormSubmit,



    updateOrganizationRelFormColumns,
    updateOrganizationRelFormDialog,
    updateOrganizationRelFormRef,
    updateOrganizationRelFormVisible,
    updateOrganizationRelFormValues,
    updateOrganizationRelFormOpen,
    updateOrganizationRelFormSubmit,

} = useConfigForm(roleOptions, treeData);


const handlePasswordFormConfirm = async (values) => {
    const isOk = await passwordFormSubmit(values);
    if (isOk) {
        onSearch();
    }
}


const handleResetPasswordFormConfirm = async (values) => {
    try {
        await ElMessageBox.confirm("确认要重置密码吗？", "提示", {
        type: "warning",
        customClass: "custom-box-top"
        });
    } catch {
        return;
    }
    const isOk = await resetPasswordFormSubmit(values);
    if (isOk) {
        onSearch();
    }
}


const handleRoleRelFormConfirm = async (values) => {
    const isOk = await updateRoleRelFormSubmit(values);
    if (isOk) {
        onSearch();
    }
}


const handleOrganizationRelFormConfirm = async (values) => {
    const isOk = await updateOrganizationRelFormSubmit(values);
    if (isOk) {
        onSearch();
    }
}


</script>

<template>

    <div class="main">
        <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
            <tree ref="treeRef" :class="['mr-2', deviceDetection() ? 'w-full' : 'min-w-[200px]']" :treeData="treeData"
                :treeLoading="treeLoading" @tree-select="onTreeSelect" />
            <div :class="[deviceDetection() ? ['w-full', 'mt-2'] : 'w-[calc(100%-200px)]']">

                <!-- 搜索栏 -->
                <el-form ref="searchFormRef" :inline="true" :model="searchForm"
                    class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto">
                    <el-form-item label="用户名称：" prop="username">
                        <el-input v-model="searchForm.username" placeholder="请输入用户名称" clearable class="w-[180px]!" />
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="phone">
                        <el-input v-model="searchForm.phone" placeholder="请输入手机号码" clearable class="w-[180px]!" />
                    </el-form-item>


                    <el-form-item label="性别：" prop="gender">
                        <el-select v-model="searchForm.gender" placeholder="请选择" clearable class="w-[180px]!">
                            <el-option v-for="(item, index) in genderOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="是否启用：" prop="enable">
                        <el-select v-model="searchForm.enable" placeholder="请选择" clearable class="w-[180px]!">
                            <el-option label="启用" value="true" />
                            <el-option label="禁用" value="false" />
                        </el-select>
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" :icon="useRenderIcon('carbon:search')" :loading="loading"
                            @click="onSearch">
                            搜索
                        </el-button>
                        <el-button :icon="useRenderIcon('carbon:reset')" @click="resetForm(searchFormRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 表格数据 -->
                <PureTableBar :columns="columns" @fullscreen="handleFullscreen" @refresh="handleRefresh">
                    <template v-if="true" #title>
                        <div>
                            <Auth value="user:btn:add">
                                <el-button type="primary" :icon="useRenderIcon('carbon:add-alt')" @click="formOpen()">
                                    新增
                                </el-button>
                            </Auth>
                            <Auth value="user:btn:delete">
                                <el-button type="danger" :icon="useRenderIcon('carbon:trash-can')" @click="onBatchDel">
                                    删除
                                </el-button>
                            </Auth>
                        </div>
                    </template>
                    <template v-slot="{ size, dynamicColumns }">

                        <div v-if="selectedNum > 0" v-motion-fade
                            class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center">
                            <div class="flex-auto">
                                <span style="font-size: var(--el-font-size-base)"
                                    class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]">
                                    已选 {{ selectedNum }} 项
                                </span>
                                <el-button type="info" text @click="onSelectionCancel">
                                    取消选择
                                </el-button>
                            </div>
                        </div>

                        <pure-table border adaptive showOverflowTooltip ref="tableRef" row-key="id" align-whole="left"
                            table-layout="auto"
                            :loading="loading" 
                            :size="size"
                            :loading-config="loadingConfig"
                            :adaptive-config="{ offsetBottom: 133 }"
                            :data="dataList" 
                            :columns="dynamicColumns"
                            :pagination="{ ...paginationProps, size }" 
                            :header-cell-style="headerCellStyle"
                            @page-size-change="onSizeChange" 
                            @page-current-change="onCurrentChange"
                            @sort-change="onSortChange"
                            @selection-change="onSelectionChange"                            
                            >

                            <template #operation="{ row }">
                                <Auth value="user:btn:edit">
                                    <el-button class="reset-margin" link type="primary" :size="size"
                                        :icon="useRenderIcon('carbon:edit')" @click="formOpen(row)">
                                        编辑
                                    </el-button>
                                </Auth>
                                <Auth value="user:btn:delete">
                                    <el-popconfirm :title="`确认要删除（${row.realname}）吗？`" :width="300"
                                        @confirm="userDelete(row)">
                                        <template #reference>
                                            <el-button class="reset-margin" link type="danger" :size="size"
                                                :icon="useRenderIcon('carbon:trash-can')">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-popconfirm>
                                </Auth>
                                <el-dropdown>
                                    <el-button class="ml-2! mt-[2px]!" link type="primary" :size="size"
                                        :icon="useRenderIcon('carbon:text-indent-more')"/>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <Auth value="user:btn:upload_avatar">
                                                <el-dropdown-item>
                                                    <el-button :class="buttonClass" link type="primary" :size="size"
                                                        :icon="useRenderIcon('carbon:fetch-upload')" @click="handleUpload(row)">
                                                        上传头像
                                                    </el-button>
                                                </el-dropdown-item>
                                            </Auth>
                                            <Auth value="user:btn:reset_passowrd">
                                                <el-dropdown-item>
                                                    <el-button :class="buttonClass" link type="primary" :size="size"
                                                        :icon="useRenderIcon('carbon:reset-alt')" @click="passwordFormOpen(row)">
                                                        重设密码
                                                    </el-button>
                                                </el-dropdown-item>
                                            </Auth>

                                            <Auth value="user:btn:update_password">
                                                <el-dropdown-item>
                                                    <el-button :class="buttonClass" link type="primary" :size="size"
                                                        :icon="useRenderIcon('carbon:hardware-security-module')" @click="resetPasswordFormOpen(row)">
                                                        重置密码
                                                    </el-button>         
                                                </el-dropdown-item>
                                            </Auth>

                                            <Auth value="user:btn:update_role_rel">
                                                <el-dropdown-item>
                                                    <el-button :class="buttonClass" link type="primary" :size="size"
                                                        :icon="useRenderIcon('carbon:user-role')" @click="updateRoleRelFormOpen(row)">
                                                        分配角色
                                                    </el-button>
                                                </el-dropdown-item>
                                            </Auth>

                                            <Auth value="user:btn:update_organization_rel">
                                                <el-dropdown-item>
                                                    <el-button :class="buttonClass" link type="primary" :size="size"
                                                        :icon="useRenderIcon('carbon:user-multiple')" @click="updateOrganizationRelFormOpen(row)">
                                                        分配机构
                                                    </el-button>
                                                </el-dropdown-item>
                                            </Auth>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>


                            </template>
                        </pure-table>
                    </template>
                </PureTableBar>


                <PlusDialogForm ref="formRef" v-model:visible="formVisible" v-model="formValues"
                    :form="{ columns: formColumns, rules: formRules, size: 'default', labelWidth: '140px', colProps: { span: 12 } }"
                    :dialog="{ ...formDialog }" @confirm="handleFormConfirm" />


                <PlusDialogForm 
                    ref="passwordFormRef" 
                    v-model:visible="passwordFormVisible" 
                    v-model="passwordFormValues"
                    :form="{ columns: passwordFormColumns, rules: passwordFormRules, size: 'default', labelWidth: '120px' }"
                    :dialog="{ ...passwordFormDialog }" 
                    @confirm="handlePasswordFormConfirm" 
                />

                <PlusDialogForm 
                    ref="resetPasswordFormRef" 
                    v-model:visible="resetPasswordFormVisible" 
                    v-model="resetPasswordFormValues"
                    :form="{ columns: resetPasswordFormColumns, size: 'default', labelWidth: '120px' }"
                    :dialog="{ ...resetPasswordFormDialog }" 
                    @confirm="handleResetPasswordFormConfirm" 
                />          



                <PlusDialogForm 
                    ref="updateRoleRelFormRef" 
                    v-model:visible="updateRoleRelFormVisible" 
                    v-model="updateRoleRelFormValues"
                    :form="{ columns: updateRoleRelFormColumns, size: 'default', labelWidth: '120px' }"
                    :dialog="{ ...updateRoleRelFormDialog }" 
                    @confirm="handleRoleRelFormConfirm" 
                />          
                


                <PlusDialogForm 
                    ref="updateOrganizationRelFormRef" 
                    v-model:visible="updateOrganizationRelFormVisible" 
                    v-model="updateOrganizationRelFormValues"
                    :form="{ columns: updateOrganizationRelFormColumns, size: 'default', labelWidth: '120px' }"
                    :dialog="{ ...updateOrganizationRelFormDialog }" 
                    @confirm="handleOrganizationRelFormConfirm" 
                />          
                
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped></style>
