<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { ElButton, ElPopconfirm, ElIcon } from "element-plus";
import { PlusDialogForm } from "plus-pro-components";
import {
    delay,
    subBefore,
    deviceDetection,
    useResizeObserver
} from "@pureadmin/utils";

import { useTable } from "./columns/column"
import { useForm } from "./columns/form"
import { useRole } from "./utils/hook"
import { immutableOptions } from "./utils/enum"
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Menu from "~icons/ep/menu";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import Close from "~icons/ep/close";
import Check from "~icons/ep/check";

// import Database from "~icons/ri/database-2-line";
// import More from "~icons/ep/more-filled";

defineOptions({
    name: "Role"
})


// 搜索表单
const searchFormRef = ref();
const tableRef = ref();

const {
    formColumns,
    formRules,
    formDialog,
    formVisible,
    formRef,
    formValues,
    formOpen,
    formSubmit,
    isAddAction
} = useForm();



// 右侧权限菜单
const treeRef = ref();
const contentRef = ref();
const {
    dataList,
    loading,
    searchForm,
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
    rowStyle,
    handleMenu,
    handleSave,
    filterMethod,
    onQueryChanged,
    closeMenu, // 添加 closeMenu

} = useRole(treeRef);

const { columns } = useTable({ roleEnable });

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

const handleAddRole = () => {
    isAddAction.value = true;
    formOpen();
};

const handleEditRole = (row: any) => {
    isAddAction.value = false;
    formOpen(row);
};



// 监听 isShow 变化，动态调整布局
watch(isShow, (newVal) => {
    if (newVal) {
        // 显示权限菜单时，等待 DOM 更新后重新计算表格
        nextTick(() => {
            if (tableRef.value) {
                tableRef.value.setAdaptive();
            }
        });
    } else {
        // 隐藏权限菜单时，等待 DOM 更新后重新计算表格
        nextTick(() => {
            if (tableRef.value) {
                tableRef.value.setAdaptive();
            }
        });
    }
});

</script>

<template>
    <div class="main">
        <!-- 搜索栏 -->
        <el-form ref="searchFormRef" :inline="true" :model="searchForm"
            class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto">
            <el-form-item label="角色名称：" prop="name">
                <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable class="w-[160px]!" />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input v-model="searchForm.remark" placeholder="请输入备注信息" clearable class="w-[160px]!" />
            </el-form-item>

            <el-form-item label="内置角色：" prop="immutable">
                <el-select v-model="searchForm.immutable" placeholder="请选择" clearable class="w-[160px]!">
                    <el-option v-for="(item, index) in immutableOptions" :key="index" :label="item.label"
                        :value="item.value" />
                </el-select>
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

        <!-- 主要内容区域 -->
        <div ref="contentRef" class="flex gap-2">
            <!-- 表格数据 -->
            <div :class="isShow ? 'w-[75%]' : 'w-full'" style="transition: width 0.3s ease;">
                <PureTableBar title="角色管理、赋权操作" :columns="columns" @fullscreen="handleFullscreen"
                    @refresh="handleRefresh">
                    <template #buttons>
                        <div>
                            <Auth value="role:btn:add">
                                <el-button type="primary" :icon="useRenderIcon('carbon:add-alt')" @click="handleAddRole()">
                                    新增
                                </el-button>
                            </Auth>
                        </div>
                    </template>

                    <template v-slot="{ size, dynamicColumns }">
                        <pure-table
                            border 
                            adaptive 
                            showOverflowTooltip 
                            ref="tableRef" 
                            row-key="id" 
                            align-whole="left"
                            table-layout="auto"
                            :loading="loading" 
                            :size="size" 
                            :adaptive-config="{ offsetBottom: 61 }" 
                            :data="dataList" 
                            :columns="dynamicColumns"
                            :header-cell-style="headerCellStyle"
                            :row-style="rowStyle"                        
                        >
                            <template #operation="{ row }">

                                <Auth value="role:btn:edit">
                                    <el-button class="reset-margin" link type="primary" :size="size"
                                        :icon="useRenderIcon('carbon:edit')" @click="handleEditRole(row)">
                                        编辑
                                    </el-button>
                                </Auth>
                                <Auth value="role:btn:delete">
                                    <el-popconfirm :title="`确认要删除（${row.name}）吗？`" :width="300" @confirm="roleDelete(row)">
                                        <template #reference>
                                            <el-button class="reset-margin" link type="danger" :size="size"
                                                :icon="useRenderIcon('carbon:trash-can')">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-popconfirm>
                                </Auth>
                                <Auth value="role:btn:config_btn">
                                    <el-button class="reset-margin" link type="primary" :size="size"
                                        :icon="useRenderIcon('carbon:two-factor-authentication')" @click="handleMenu(row)">
                                        权限
                                    </el-button>
                                </Auth>
                            </template>
                        </pure-table>
                    </template>
                </PureTableBar>
            </div>

            <!-- 右侧权限菜单 -->
            <div v-show="isShow" class="w-[25%] bg-bg_color border-gray-300 mt-2">

                <div class="p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold">
                            菜单权限
                            {{ `${curRow?.name ? `（${curRow.name}）` : ""}` }}
                        </h3>
                        <div class="flex gap-2">
                            <Auth value="role:btn:config">
                                <el-button size="small" @click="handleSave" type="primary">
                                    <el-icon>
                                        <Check />
                                    </el-icon>
                                    保存
                                </el-button>
                            </Auth>          
                            <el-button size="small" @click="closeMenu" type="danger">
                                <el-icon>
                                    <Close />
                                </el-icon>
                                关闭
                            </el-button>
                        </div>
                    </div>

                    <el-input v-model="treeSearchValue" placeholder="请输入菜单进行搜索" class="mb-3" clearable
                        @input="onQueryChanged" />

                    <div class="flex flex-wrap gap-3 mb-3">
                        <el-checkbox v-model="isExpandAll" label="展开/折叠" />
                        <el-checkbox v-model="isSelectAll" label="全选/全不选" />
                        <el-checkbox v-model="isLinkage" label="父子联动" />
                    </div>

                    <!-- 树组件 -->
                    <div class="border border-gray-200 rounded p-2 h-[405px] overflow-hidden">
                        <el-tree-v2 ref="treeRef" 
                            show-checkbox 
                            :data="treeData" 
                            :props="treeProps" 
                            :height="382"
                            :check-strictly="!isLinkage" :filter-method="filterMethod" node-key="id">
                            <template #default="{ node }">
                                <span class="text-sm">{{ node.name || node.title || node.label || '未知节点' }}</span>
                            </template>
                        </el-tree-v2>
                    </div>
                </div>
            </div>
        </div>

        <PlusDialogForm 
            ref="formRef" 
            v-model:visible="formVisible" 
            v-model="formValues"
            :form="{ columns: formColumns, rules: formRules, size: 'large', labelWidth: '100px' }"
            :dialog="{ ...formDialog }" @confirm="handleFormConfirm" 
            />

    </div>
</template>

<style lang="scss" scoped>
:deep(.el-dropdown-menu__item i) {
    margin: 0;
}

.main-content {
    margin: 24px 24px 0 !important;
}

.search-form {
    :deep(.el-form-item) {
        margin-bottom: 12px;
    }
}

// 确保权限菜单区域可见
.main {
    position: relative;
    overflow: visible;
}

// 调试样式
.debug-info {
    font-family: monospace;
    font-size: 12px;
    background: #f0f0f0;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 16px;
}

</style>