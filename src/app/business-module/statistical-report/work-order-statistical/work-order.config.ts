import { NzI18nService } from 'ng-zorro-antd';

export enum DeviceTypeCode {
    Optical_Box = '001',   // 光交箱
    Well = '030',          // 人井
    Distribution_Frame = '060', // 配线架
    Junction_Box = '090',   // 接头盒
    // Splitting_Box = '150',   // 分纤箱
    OUTDOOR_CABINET = '210'  // 室外柜
}

export const WORK_ORDER_ERROR_REASON_CODE = {
    other: '0', // 0 其他
    personDamage: '1', // 1 人为损坏
    RoadConstruction: '2', // 2 道路施工
    stealWear: '3', // 3 盗穿
    clearBarrier: '4' // 4 销障
};

export const WORK_ORDER_PROCESSING_CODE = {
    other: '0', // 0 其他
    repair: '1', // 1 报修
    destruction: '2', // 2 现场销障
};


export function getDeviceType(i18n: NzI18nService, code = null): any {
    return _codeTranslate(DeviceTypeCode, i18n, code);
}


export function getErrorReason(i18n: NzI18nService, code = null) {
    return codeTranslate(WORK_ORDER_ERROR_REASON_CODE, i18n, code);
}


export function getProcessing(i18n: NzI18nService, code = null) {
    return codeTranslate(WORK_ORDER_PROCESSING_CODE, i18n, code);
}

/**
 * 枚举翻译
 */
function codeTranslate(codeEnum, i18n: NzI18nService, code = null) {
    if (code !== null) {
        for (const i of Object.keys(codeEnum)) {
            if (codeEnum[i] === code) {
                return i18n.translate(`workOrder.${i}`);
            }
        }
    } else {
        return Object.keys(codeEnum)
            .map(key => ({ label: i18n.translate(`workOrder.${key}`), code: codeEnum[key] }));
    }
}


export function _codeTranslate(codeEnum, i18n: NzI18nService, code = null) {
    if (code !== null) {
        for (const i of Object.keys(codeEnum)) {
            if (codeEnum[i] === code) {
                return i18n.translate(`facility.config.${i}`);
            }
        }
    } else {
        return Object.keys(codeEnum)
            .map(key => ({ label: i18n.translate(`facility.config.${key}`), code: codeEnum[key] }));
    }
}
