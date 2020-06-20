// 告警对象弹框
export class TroubleFacilityConfig {
  public type?: 'form' | 'table'; // 传递的类型 'form' 和 'table' 默认 'table';
  public initialValue?; // 默认值
  public clear?: boolean;  // true 清除数据
  public facilityObject: any; // 点击确定时 触发的回调函数
}
