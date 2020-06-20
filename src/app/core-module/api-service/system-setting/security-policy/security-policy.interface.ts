export interface SecurityPolicyInterface {
  /**
   * 查询当前密码安全策略
   */
  queryPasswordPresent(type);


  /**
   * 更新密码安全策略
   */
  updatePasswordStrategy(body);

  /**
   * 查询当前账号安全策略
   */
  queryAccountPresent(queryAccountPresent);


  /**
   * 更新账号安全策略
   */
  updateAccountStrategy(body);

  /**
   * 查询访问控制列表
   */
  queryRangesAll(body);

  /**
   * 删除访问控制列表
   * param body
   */
  deleteRanges(body);

  /**
   * 访问控制新增ip范围
   * param body
   */
  addIpRange(body);

  /**
   * 修改IP范围
   * param body
   */
  updateIpRange(body);

  /**
   * 获取单个ip详情
   * param body
   */
  queryRangeId(body);

  /**
   * 启用/禁用状态更新
   * param body
   */
  updateRangeStatus(body);

  /**
   * 全部启用或者禁用
   * param body
   */
  updateAllRangesStatus(body);


  /**
   *查询账号安全策略
   */
  queryAccountSecurity();

  /**
   * 查询密码安全策略
   */
  queryPasswordSecurity();

}
