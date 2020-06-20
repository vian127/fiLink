
// 故障设备
export class TroubleObjectConfig {
   public type?: 'form' | 'table'; // 传递的类型 'form' 和 'history-process-record-table' 默认 'history-process-record-table';
   public initialValue?; // 默认值
   public clear?: boolean;  // true 清除数据
   public troubleObject: any; // 点击确定时 触发的回调函数
}

