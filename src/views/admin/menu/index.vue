<script setup lang="ts">
import { ref } from 'vue'
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { ElButton, ElPopconfirm } from "element-plus";
import { PlusDialogForm } from "plus-pro-components";

import "@/style/box.css"
import { useTable } from "./columns/column"
import { useForm } from "./columns/form"
import { useMenu } from "./utils/hook"


defineOptions({
    name: "Role"
})

// 搜索表单
const searchFormRef = ref();
const tableRef = ref();

const {
    dataList,
    loading,
    searchForm,
    onSearch,
    menuDelete,
    menuEnable,
    higherMenus
} = useMenu();

const {
    formColumns,
    formRules,
    formDialog,
    formVisible,
    formRef, // 新增、编辑表单
    formValues,
    formOpen,
    formSubmit,
    isAddAction
} = useForm(higherMenus);


const { columns } = useTable({ menuEnable });

const handleRefresh = () => {
    onSearch();
};

const handleFullscreen = () => {
    // 重置表格高度
    tableRef.value.setAdaptive();
};


const headerCellStyle = {
    background: "var(--el-fill-color-light)",
    color: "var(--el-text-color-primary)"
};


const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
};

const handleFormConfirm = async (values) => {
    const isOk = await formSubmit(values);
    if (isOk) {
        onSearch();
    }
};

const handleAddMenu = () => {
    isAddAction.value = true;
    formOpen();
};

const handleEditRole = (row: any) => {
    isAddAction.value = false;
    formOpen(row);
};

</script>

<template>
    <div class="main">
        <!-- 搜索栏 -->
        <el-form ref="searchFormRef" :inline="true" :model="searchForm"
            class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto">
            <el-form-item label="菜单名称：" prop="name">
                <el-input v-model="searchForm.name" placeholder="请输入菜单名称" clearable class="w-[160px]!" />
            </el-form-item>
            <el-form-item label="权限标识：" prop="authKey">
                <el-input v-model="searchForm.authKey" placeholder="请输入权限标识" clearable class="w-[160px]!" />
            </el-form-item>
            <el-form-item label="是否启用：" prop="enable">
                <el-select v-model="searchForm.enable" placeholder="请选择" clearable class="w-[160px]!">
                    <el-option label="启用" value="true" />
                    <el-option label="禁用" value="false" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" :icon="useRenderIcon('carbon:search')" :loading="loading" @click="onSearch">
                    搜索
                </el-button>
                <el-button :icon="useRenderIcon('carbon:reset')" @click="resetForm(searchFormRef)">
                    重置
                </el-button>
            </el-form-item>
        </el-form>

        <!-- 表格数据 -->
        <PureTableBar 
            title="菜单、按钮、权限管理"
            :is-expand-all="true"
            :table-ref="tableRef?.getTableRef()"
            :columns="columns" 
            @fullscreen="handleFullscreen" 
            @refresh="handleRefresh"
            >
            <template #buttons>
                <div>
                    <Auth value="menu:btn:add">
                        <el-button type="primary" :icon="useRenderIcon('carbon:add-alt')" @click="handleAddMenu()">
                            新增
                        </el-button>
                    </Auth>
                </div>
            </template>

            <template v-slot="{ size, dynamicColumns }">
                <pure-table border adaptive showOverflowTooltip ref="tableRef" row-key="id" align-whole="left"
                    table-layout="auto"
                    :loading="loading" 
                    :size="size" 
                    :adaptive-config="{ offsetBottom: 61 }" 
                    :data="dataList" 
                    :columns="dynamicColumns"
                    :header-cell-style="headerCellStyle"
                    :default-expand-all="true"
                    >

                    <template #operation="{ row }">
                        <Auth value="menu:btn:edit">
                            <el-button class="reset-margin" link type="primary" :size="size"
                                :icon="useRenderIcon('carbon:edit')" @click="handleEditRole(row)">
                                编辑
                            </el-button>
                        </Auth>
                        <Auth value="menu:btn:delete">
                            <el-popconfirm :title="`确认要删除（${row.name}）吗？`" :width="300" @confirm="menuDelete(row)">
                                <template #reference>
                                    <el-button class="reset-margin" link type="danger" :size="size"
                                        :icon="useRenderIcon('carbon:trash-can')">
                                        删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </Auth>
                    </template>
                </pure-table>
            </template>
        </PureTableBar>

        <PlusDialogForm 
            ref="formRef"
            v-model:visible="formVisible" 
            v-model="formValues"
            :form="{ columns: formColumns, rules: formRules, size: 'default', labelWidth: '100px', colProps: { span: 12 } }"
            :dialog="{ ...formDialog }" 
            @confirm="handleFormConfirm" />
    </div>
</template>

<style lang="scss" scoped></style>
