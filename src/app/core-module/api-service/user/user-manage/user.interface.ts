import {Observable} from 'rxjs';

export interface UserInterface {
  /**
   * 获取用户列表信息
   */
  queryUserList(body): Observable<Object>;

  queryUserLists(body): Observable<Object>;

  queryUserByPermission(body): Observable<Object>;

  /**
   *新增用户
   */
  addUser(body): Observable<Object>;


  /**
   *删除用户
   */
  deleteUser(body): Observable<Object>;


  /**
   * 修改用户
   */
  modifyUser(body): Observable<Object>;

  /**
   * 获取单个用户信息
   */
  queryUserInfoById(id: string): Observable<Object>;

  /**
   *更新用户状态
   */
  updateUserStatus(status, idArray): Observable<Object>;

  /**
   * 用户校验
   */
  verifyUserInfo(body): Observable<Object>;

  /**
   * 邮箱校验
   */
  queryEmailIsExist(body): Observable<Object>;

  /**
   * 重置密码
   */
  restPassword(body): Observable<Object>;

  /**
   * 修改密码
   */
  modifyPassword(body): Observable<Object>;

  /**
   * 退出登入
   */
  logout(body): Observable<Object>;

  /**
   *查询用户密码
   */
  queryPassword(): Observable<Object>;

  /**
   * 导入用户
   */
  importUser(body): Observable<Object>;

  /**
   * 导出用户
   */
  exportUserList(body): Observable<Object>;

  /**
   * 查询部门列表信息
   */
  queryDeptList(body): Observable<Object>;

  /**
   *不分页查询部门信息
   * returns {Observable<Object>}
   */
  queryAllDepartment(): Observable<Object>;

  /**
   * 查询单个部门信息
   */
  queryDeptInfoById(id: string): Observable<Object>;

  /**
   * 新增单个部门
   */
  addDept(body): Observable<Object>;

  /**
   * 删除单个部门
   */
  deleteDept(body): Observable<Object>;

  /**
   * 修改部门信息
   */
  modifyDept(body): Observable<Object>;

  /**
   *查询所有单位/部门(无分页)
   */
  queryTotalDept(): Observable<Object>;

  /**
   * 查询所有部门(有分页)
   */
  queryAllDept(body): Observable<Object>;

  /**
   * 查询所有部门(平级)
   */
  queryTotalDepartment(): Observable<Object>;

  /**
   *单位部门校验
   */
  verifyDeptInfo(body): Observable<Object>;

  /**
   *查询角色列表信息
   */
  queryRoleList(body): Observable<Object>;

  queryRoles(body): Observable<Object>;

  /**
   * 查询所有角色(无分页)
   */
  queryAllRoles(): Observable<Object>;

  /**
   * 查询单个角色信息
   */
  queryRoleInfoById(id: string): Observable<Object>;

  /**
   * 新增单个角色
   */
  addRole(body): Observable<Object>;

  /**
   * 修改角色信息
   */
  modifyRole(body): Observable<Object>;

  /**
   * 删除单个角色
   */
  deleteRole(body): Observable<Object>;

  /**
   * 角色校验
   */
  verifyRoleInfo(body): Observable<Object>;

  /**
   * 获取在线用户列表信息
   */
  getOnLineUser(body): Observable<Object>;

  /**
   * 强制下线在线用户
   */
  offline(body): Observable<Object>;

  /**
   * 查询统一授权列表信息
   */
  queryUnifyAuthList(body): Observable<Object>;

  /**
   * 新增统一授权
   */
  addUnifyAuth(body): Observable<Object>;

  /**
   * 查询单个统一授权信息
   */
  queryUnifyAuthById(body): Observable<Object>;

  /**
   * 修改统一授权信息
   */
  modifyUnifyAuth(body): Observable<Object>;

  /**
   * 删除单个统一授权信息
   */
  deleteUnifysAuthById(body): Observable<Object>;

  /**
   * 批量删除统一授权信息
   */
  deleteUnifysAuthByIds(body): Observable<Object>;


  /**
   * 批量生效/禁用统一授权信息状态
   */
  batchModifyUnifyAuthStatus(body): Observable<Object>;


  /**
   * 查询临时授权列表信息
   */
  queryTempAuthList(body): Observable<Object>;

  /**
   * 查询单个临时授权信息
   */
  queryTempAuthById(id): Observable<Object>;

  /**
   * 审核单个临时授权
   */
  audingTempAuthById(body): Observable<Object>;


  /**
   * 批量审核临时授权
   */
  audingTempAuthByIds(body): Observable<Object>;


  /**
   * 删除单个临时授权信息
   */
  deleteTempAuthById(id): Observable<Object>;


  /**
   * 批量删除临时授权信息
   */
  deleteTempAuthByIds(body): Observable<Object>;


  /**
   * 查询顶级权限
   */
  queryTopPermission(): Observable<Object>;


  /**
   * 根据设施ids查询设备信息
   */
  getDeviceByIds(body): Observable<Object>;


  /**
   * app查用户权限
   */
  queryUserAuthInfoById(): Observable<Object>;

  /**
   * 授权名称校验
   */
  queryAuthByName(body): Observable<Object>;

  /**
   * 获取所有的设施集
   */
  getDeviceType(): Observable<Object>;
}


