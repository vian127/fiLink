export interface LoginInterface {
  /**
   * 登入接口
   * param params
   */
  login(params);

  /**
   * licenes验证
   */
  validateLicense();
  /**
   * 获取验证码
   */
  getVerificationCode(body);

  /**
   * 提交License
   * param params
   */
  uploadLicense(body);
  /**
   * 手机登录
   */
  phoneLogin(body);
}
