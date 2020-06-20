import { NzI18nService } from 'ng-zorro-antd';

export const DeptLevel = {
    DEPT_LEVEL_ONE: '1',
    DEPT_LEVEL_TWO: '2',
    DEPT_LEVEL_THREE: '3',
    DEPT_LEVEL_FOUR: '4',
    DEPT_LEVEL_FIVE: '5'
};

export const DoorNumber = {
    DOOR_ONE: '1',
    DOOR_TWO: '2',
    DOOR_THREE: '3',
    DOOR_FOUR: '4'
};

export function getDeptLevel(i18n: NzI18nService, code = null) {
    return codeTranslate(DeptLevel, i18n, code);
}

export function getDoorNumber(i18n: NzI18nService, code = null) {
    return codeTranslate(DoorNumber, i18n, code);
}

/**
 * 枚举翻译
 * param codeEnum
 * param {NzI18nService} i18n
 * param {any} code
 * returns {any}
 */
function codeTranslate(codeEnum, i18n: NzI18nService, code = null) {
    if (code) {
        for (const i of Object.keys(codeEnum)) {
            if (codeEnum[i] === code) {
                return i18n.translate(`unit.config.${i}`);
            }
        }
    } else {
        return Object.keys(codeEnum)
            .map(key => ({ label: i18n.translate(`unit.config.${key}`), code: codeEnum[key] }));
    }
}
