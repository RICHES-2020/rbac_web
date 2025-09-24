/**
 * 性别
 */

export enum GenderType {
  // 男
  MALE = "Male",
  // 女
  FEMALE = "Female",
  // 未知
  OTHER = "-"
}


// 性别枚举标签
export const genderOptions = [
  {
    label: "男",
    value: GenderType.MALE
  },
  {
    label: "女",
    value: GenderType.FEMALE
  },
  {
    label: "未知",
    value: GenderType.OTHER
  }
];

// 性别枚举Map
export const genderMap = new Map(
  genderOptions.map(item => [item.value, item.label])
);

// 获取性别标签
export const getGenderLabel = (value: GenderType): string => {
  return genderMap.get(value) || "";
};









/**
 * 组织机构Mock数据
 */


export const organizationOptions = [
  {
    value: "001",
    label: "美国",
    children: [
      {
        value: "001-206",
        label: "华盛顿特区",
      }
    ]
  },
  {
    value: "0086",
    label: "中国",
    children: [
      {
        value: "0086-01",
        label: "北京市",
      },
      {
        value: "0086-02",
        label: "上海市",
      },
      {
        value: "0086-34",
        label: "安徽省",
        children: [
          {
            value: "0086-34-01",
            label: "合肥市",
          },
          {
            value: "0086-34-02",
            label: "芜湖市",
          }
        ]
      }
    ]
  }
];


// 角色Mock数据
export const roleOptions = [
  {
    label: "管理员",
    value: "ADMINISTRATOR"
  },
  {
    label: "超级管理员",
    value: "SUPER-ADMINISTRATOR"
  }
];