import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserInterface} from './user.interface';
import {Observable} from 'rxjs';
import {
  DELETE_DEPT,
  DELETE_USER,
  DELETE_ROLE,
  INSERT_DEPT,
  INSERT_ROLE,
  INSERT_USER,
  MODIFY_PASSWORD,
  QUERY_ALL_DEPARTMENT,
  QUERY_DEPT_INFO_BY_ID,
  QUERY_DEPT_LIST,
  QUERY_ROLE_INFO_BY_ID,
  QUERY_ROLE_LIST,
  QUERY_ROLES_LIST,
  QUERY_ALL_ROLES,
  QUERY_USER_INFO_BY_ID,
  QUERY_USER_LIST,
  QUERY_USER_LISTS,
  QUERY_USER_BY_PERMISSION,
  QUERY_TOTAL_DEPT,
  QUERY_TOTAL_DEPARTMENT,
  QUERY_ALL_DEPT,
  RESET_PASSWORD,
  QUERY_PASSWORD,
  UPDATE_DEPT,
  UPDATE_ROLE,
  UPDATE_USER,
  UPDATE_USER_STATUS,
  VERIFY_USER_INFO,
  QUERY_EMAIL_IS_EXIST,
  VERIFY_ROLE_INFO,
  VERIFY_DEPT_INFO,
  GET_ONLINE_USER,
  OFFLINE,
  LOGOUT,
  QUERY_UNIFY_AUTH_LIST,
  ADD_UNIFY_AUTH,
  QUERY_UNIFY_AUTH_BY_ID,
  MODIFY_UNIFY_AUTH,
  DELETE_UNIFY_AUTH_BY_ID,
  DELETE_UNIFY_AUTH_BY_IDS,
  QUERY_TEMP_AUTH_LIST,
  QUERY_TEMP_AUTH_BY_ID,
  AUDING_TEMP_AUTH_BY_ID,
  AUDING_TEMP_AUTH_BY_IDS,
  DELETE_TEMP_AUTH_BY_ID,
  DELETE_TEMP_AUTH_BY_IDS,
  BATCH_MODIFY_UNIFY_AUTH_STATUS,
  IMPORT_USER,
  EXPORT_USER,
  QUERY_TOP_PERMISSION,
  GET_DEVICE_BY_IDS,
  QUERY_USER_UNIFY_AUTH_BY_ID,
  QUERY_AUTH_BY_NAME, GET_DEVICE_TYPE
} from '../user-request-url';

@Injectable()
export class UserService implements UserInterface {

  constructor(private $http: HttpClient) {
  }

  /**
   *用户管理...
   */
  queryUserList(body): Observable<Object> {
    return this.$http.post(`${QUERY_USER_LIST}`, body);
  }

  queryUserLists(body): Observable<Object> {
    return this.$http.post(`${QUERY_USER_LISTS}`, body);
  }

  queryUserByPermission(body): Observable<Object> {
    return this.$http.post(`${QUERY_USER_BY_PERMISSION}`, body);
  }

  addUser(body): Observable<Object> {
    return this.$http.post(`${INSERT_USER}`, body);
  }


  deleteUser(body): Observable<Object> {
    return this.$http.post(`${DELETE_USER}`, body);
  }


  modifyUser(body): Observable<Object> {
    return this.$http.post(`${UPDATE_USER}`, body);
  }


  queryUserInfoById(id: string): Observable<Object> {
    return this.$http.post(`${QUERY_USER_INFO_BY_ID}` + `${id}`, null);
  }

  updateUserStatus(status: number, idArray: any): Observable<Object> {
    return this.$http.get(`${UPDATE_USER_STATUS}?userStatus=${status}&userIdArray=${idArray}`);
  }

  verifyUserInfo(body): Observable<Object> {
    return this.$http.post(`${VERIFY_USER_INFO}`, body);
  }

  queryEmailIsExist(body): Observable<Object> {
    return this.$http.post(`${QUERY_EMAIL_IS_EXIST}`, body);
  }

  restPassword(body): Observable<Object> {
    return this.$http.post(`${RESET_PASSWORD}`, body);
  }

  modifyPassword(body): Observable<Object> {
    return this.$http.post(`${MODIFY_PASSWORD}`, body);
  }

  logout(body): Observable<Object> {
    return this.$http.get(`${LOGOUT}/${body.userid}/${body.token}`);
  }

  queryPassword(): Observable<Object> {
    return this.$http.post(`${QUERY_PASSWORD}`, {});
  }


  importUser(body): Observable<Object> {
    return this.$http.post(`${IMPORT_USER}`, body);
  }

  exportUserList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_USER}`, body);
  }

  /**
   * 单位列表...
   */
  queryDeptList(body): Observable<Object> {
    return this.$http.post(`${QUERY_DEPT_LIST}`, body);
  }


  queryAllDepartment(): Observable<Object> {
    return this.$http.post(`${QUERY_ALL_DEPARTMENT}`, {});
  }


  queryDeptInfoById(id: string): Observable<Object> {
    return this.$http.post(`${QUERY_DEPT_INFO_BY_ID}` + `${id}`, null);
  }

  addDept(body): Observable<Object> {
    return this.$http.post(`${INSERT_DEPT}`, body);
  }

  deleteDept(body): Observable<Object> {
    return this.$http.post(`${DELETE_DEPT}`, body);
  }

  modifyDept(body): Observable<Object> {
    return this.$http.put(`${UPDATE_DEPT}`, body);
  }

  queryTotalDept(): Observable<Object> {
    return this.$http.post(`${QUERY_TOTAL_DEPT}`, {});
  }

  queryAllDept(body): Observable<Object> {
    return this.$http.post(`${QUERY_ALL_DEPT}`, body);
  }

  verifyDeptInfo(body): Observable<Object> {
    return this.$http.post(`${VERIFY_DEPT_INFO}`, body);
  }

  queryTotalDepartment(): Observable<Object> {
    return this.$http.post(`${QUERY_TOTAL_DEPARTMENT}`, {});
  }

  /**
   * 角色管理...
   */
  queryRoleList(body): Observable<Object> {
    return this.$http.post(`${QUERY_ROLE_LIST}`, body);
  }

  queryRoles(body): Observable<Object> {
    return this.$http.post(`${QUERY_ROLES_LIST}`, body);
  }

  queryAllRoles(): Observable<Object> {
    return this.$http.post(`${QUERY_ALL_ROLES}`, {});
  }

  queryRoleInfoById(id: string): Observable<Object> {
    return this.$http.post(`${QUERY_ROLE_INFO_BY_ID}` + `${id}`, null);
  }


  addRole(body): Observable<Object> {
    return this.$http.post(`${INSERT_ROLE}`, body);
  }

  modifyRole(body): Observable<Object> {
    return this.$http.post(`${UPDATE_ROLE}`, body);
  }


  deleteRole(body): Observable<Object> {
    return this.$http.post(`${DELETE_ROLE}`, body);
  }

  verifyRoleInfo(body): Observable<Object> {
    return this.$http.post(`${VERIFY_ROLE_INFO}`, body);
  }

  /**
   * 在线用户
   */
  getOnLineUser(body): Observable<Object> {
    return this.$http.post(`${GET_ONLINE_USER}`, body);
  }

  offline(body): Observable<Object> {
    return this.$http.post(`${OFFLINE}`, body);
  }

  /**
   * 统一授权
   */
  queryUnifyAuthList(body): Observable<Object> {
    return this.$http.post(`${QUERY_UNIFY_AUTH_LIST}`, body);
  }

  addUnifyAuth(body): Observable<Object> {
    return this.$http.post(`${ADD_UNIFY_AUTH}`, body);
  }

  queryUnifyAuthById(body): Observable<Object> {
    return this.$http.get(`${QUERY_UNIFY_AUTH_BY_ID}/${body}`);
  }


  modifyUnifyAuth(body): Observable<Object> {
    return this.$http.post(`${MODIFY_UNIFY_AUTH}`, body);
  }

  deleteUnifysAuthById(body): Observable<Object> {
    return this.$http.post(`${DELETE_UNIFY_AUTH_BY_ID}/${body}`, null);
  }

  deleteUnifysAuthByIds(body): Observable<Object> {
    return this.$http.post(`${DELETE_UNIFY_AUTH_BY_IDS}`, body);
  }

  batchModifyUnifyAuthStatus(body): Observable<Object> {
    return this.$http.post(`${BATCH_MODIFY_UNIFY_AUTH_STATUS}`, body);
  }


  /**
   * 临时授权
   */
  queryTempAuthList(body): Observable<Object> {
    return this.$http.post(`${QUERY_TEMP_AUTH_LIST}`, body);
  }


  queryTempAuthById(id): Observable<Object> {
    return this.$http.get(`${QUERY_TEMP_AUTH_BY_ID}/${id}`);
  }

  audingTempAuthById(body): Observable<Object> {
    return this.$http.post(`${AUDING_TEMP_AUTH_BY_ID}`, body);
  }

  audingTempAuthByIds(body): Observable<Object> {
    return this.$http.post(`${AUDING_TEMP_AUTH_BY_IDS}`, body);
  }


  deleteTempAuthById(id): Observable<Object> {
    return this.$http.get(`${DELETE_TEMP_AUTH_BY_ID}/${id}`);
  }

  deleteTempAuthByIds(body): Observable<Object> {
    return this.$http.post(`${DELETE_TEMP_AUTH_BY_IDS}`, body);
  }


  queryTopPermission(): Observable<Object> {
    return this.$http.post(`${QUERY_TOP_PERMISSION}`, {});
  }

  getDeviceByIds(body): Observable<Object> {
    return this.$http.post(`${GET_DEVICE_BY_IDS}`, body);
  }


  queryUserAuthInfoById(): Observable<Object> {
    return this.$http.get(`${QUERY_USER_UNIFY_AUTH_BY_ID}`);
  }

  queryAuthByName(body): Observable<Object> {
    return this.$http.post(`${QUERY_AUTH_BY_NAME}`, body);
  }

  getDeviceType(): Observable<Object> {
    return this.$http.get(GET_DEVICE_TYPE);
  }
}

