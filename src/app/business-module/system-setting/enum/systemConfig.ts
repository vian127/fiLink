export enum SystemParameterConfig {
  MSG = '7', // 消息设置
  EMAIL = '6', // 邮箱设置
  NOTE = '5', // 短息设置
  PUSH = '8', // 推送设置
  SHOW = '9', // 显示设置
  FTP = '10', // ftp设置
  ACCOUNTPRESENT = '0', // 账户安全策略
  PASSWORDPRESENT = '1', // 密码安全策略
  HTTPSERVE = '2',    // http服务设置
  HTTPSSERVE = '3',  // https服务设置
  WEBSERVICESERVE = '4', // web服务设置

}

// xml文件校验
export enum XmlLimitConfig {
  nameLength = 32,
  size = 1048576
}
