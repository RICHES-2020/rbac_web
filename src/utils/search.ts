
const paramConvertor = (
    keywords = {},
    fiterFields: string[],
    extraFields: string[] = []) => {

        // 时间区间查询字段
    const dateFields = ["createTime", "updateTime", ...extraFields];

    const searchBys = [];
    const filterBys = [];
    const dateBys = [];

    Object.keys(keywords).forEach(key => {
        const value = keywords[key];
        // 值为空则不加入检索条件中
        if (
            (typeof value === "string" && value.length)
            || (Array.isArray(value) && value.length)
            || (value && typeof value === "object" && Object.keys(key).length)
            || typeof value === "boolean"
            || typeof value === "number"
        ) {
            if (fiterFields.includes(key)) {
                filterBys.push(
                    {
                        key,
                        values: [value]
                    }
                );
            } else if (dateFields.includes(key)) {
                dateBys.push(
                    {
                        key,
                        beginTime: value?.[0],
                        endTime: value?.[1]
                    }
                );
            } else {
                searchBys.push(
                    {
                        key,
                        values: [value]
                    }
                );
            }
        }
    });
    return { searchBys, filterBys, dateBys };
};

const sortConvertor = (field: any) => {
    if (field.prop === null) {
        return [];
    }
    return [
        {
            key: field.prop,
            direction: field.order == "ascending" ? "ASC" : "DESC"
        }
    ];
};


export { paramConvertor, sortConvertor };

