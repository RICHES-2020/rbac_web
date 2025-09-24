import { Ref } from "vue";

const resetFormRef = (formRef: Ref) => {
    if (formRef.value && formRef.value.formInstance) {
        const formInstance = formRef.value.formInstance;
        // 清除校验状态
        if (typeof formInstance.clearValidate === 'function') {
            formInstance.clearValidate();
        }
        // 重置表单字段
        if (typeof formInstance.resetFields === 'function') {
            formInstance.resetFields();
        }
    }
}


const genderTag = (type, text = false) => {
    if (type) {
        if (text) {
            return type?.name
        }
        switch (type.id) {
            case "Male":
                return "success";
            case "Female":
                return "primary";
            case "-":
                return "danger";
        }
    }
};


// ---------- 递归过滤树状菜单 ----------
export type TreeNode = {
    id: string;
    parentId: string;
    name: string;
    type: any;
    children: TreeNode[]
}

const filterTree = <T extends TreeNode>(nodes: T[], predicate: (node: T) => boolean): T[] => {
    return nodes.map(node => {
        return filterNode(node, predicate);
    }).filter((node): node is T => node !== null);
}

const filterNode = <T extends TreeNode>(node: T, predicate: (node: T) => boolean): T => {
    const newNode = { ...node }
    if (newNode.children && newNode.children.length > 0) {
        const filterChildren = filterTree(newNode.children, predicate);
        if (filterChildren.length > 0) {
            newNode.children = filterChildren;
        } else {
            delete newNode.children;
        }
    }
    if (predicate(newNode) || (newNode.children && newNode.children.length > 0)) {
        return newNode;
    }
    return null;
}

// ---------- 递归过滤树状菜单 ----------

export { resetFormRef, genderTag, filterTree, filterNode }