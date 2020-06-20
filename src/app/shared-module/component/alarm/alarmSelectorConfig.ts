// 告警名称弹框
export class AlarmNameConfig {
   public type?: 'form' | 'table'; // 传递的类型 'form' 和 'table' 默认 'table';
   public initialValue?; // 默认值
   public disabled?: boolean; // true 为禁用
   public clear?: boolean;  // true 清除数据
   public alarmName: any; // 点击确定后 触发的回调函数
}

// 告警对象弹框
export class AlarmObjectConfig {
   public type?: 'form' | 'table'; // 传递的类型 'form' 和 'table' 默认 'table';
   public initialValue?; // 默认值
   public clear?: boolean;  // true 清除数据
   public alarmObject: any; // 点击确定时 触发的回调函数
}

// 区域弹框
export class AreaConfig {
   public type?: 'form' | 'table'; // 传递的类型 'form' 和 'table' 默认 'table';
   public initialValue?; // 默认值
   public areadisplay?: boolean; // true 禁用
   public userIds?: any[];  // 在告警远程通知中 选择用户后 根据用户ID 请求区域
   public clear?: boolean;  // true 清除数据
   public checkArea: any; // 点击 确定后 触发的回调函数
}

// 用户
export class User {
   public type?: 'form' | 'table'; // 传递的类型 'form' 和 'table' 默认 'table';
   public initialValue?; // 默认值
   public clear?: boolean;  // true 清除数据
   public condition?: any; // 远程通知新增 编辑页面 通过选择的区域和设施类型 查询通知人
   public disabled?: boolean; // 禁 启
   public checkUser: any;
}

// 责任单位
export class UnitConfig {
   public type?: 'form' | 'table'; // 传递的类型 'form' 和 'table' 默认 'table';
   public initialValue?; // 默认值
   public clear?: boolean;  // true 清除数据
   public checkUnit: any;
}

// 告警持续时间
export class AlarmContinueTimeConfig {
   public type?: 'form' | 'table'; // 传递的类型 'form' 和 'table' 默认 'table';
   public clear?: boolean;  // true 清除数据
   public initialValue?; // 默认值
   public checkAlarmContinueTime: any;
}
