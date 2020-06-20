import {Observable} from 'rxjs';

export interface SystemParameterInterface {


  /**
   * 更新设置
   */
  updateSystem(type, body);

  /**
   * 获取系统语言
   */
  queryLanguage();

  /**
   * 查询系统初始化配置
   */
  selectDisplaySettingsParamForPageCollection();

  /**
   * email测试
   */
  testEmail(body);

  /**
   * phone测试
   */
  testPhone(body);
  /**
   * phone测试
   */
  ftpSettingsTest(body);

  /**
   * 查询列设置
   */
  queryColumnSetting(): Observable<Object>;

  /**
   * 保存列设置
   */
  saveColumnSetting(body): Observable<Object>;

}
