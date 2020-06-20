import {COMMON_PREFIX, SYSTEM_SERVER, USER_SERVER} from '../api-common.config';


const menuLogin = '/filink';

export const loginRequireUrl = {
  login: `${COMMON_PREFIX}${menuLogin}/login`,
  validateLicenseTime: `${SYSTEM_SERVER}/licenseInfo/validateLicenseTime`,
  uploadLicense: `zuul/${SYSTEM_SERVER}/licenseInfo/uploadLicenseForAdmin`,

  // 获取验证码
  GET_VERIFICATION_CODE: `${USER_SERVER}/user/sendMessage`,

  // 手机登录
  PHONE_LOGIN: `/auth/phone`,
};
