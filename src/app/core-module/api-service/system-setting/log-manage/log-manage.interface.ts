export interface LogManageInterface {
  /**
   * 查询系统日志
   * param params
   */
  findSystemLog(params);

  /**
   * 查询操作日志
   * param params
   */
  findOperateLog(params);

  /**
   * 安全日志
   * param params
   */
  findSecurityLog(params);

  /**
   * 导出系统日志
   */
  exportSysLogExport(body);

  /**
   * 导出操作日志
   */
  exportOperateLogExport(body);

  /**
   * 导出安全日志
   */
  exportSecurityLogExport(body);
}
