import {DEVICE_CODE} from '../../shared-module/const/facility';

export class FacilityUtil {

  /**
   * 设施类型配置
   * param arr { label: string, code: any }[]
   */
  public static deviceTypeSort(arr: { label: string, code: any }[]): { label: string, code: any }[] {
    // 权重排序标准
    const arrSort = [DEVICE_CODE.ateway, DEVICE_CODE.screen, DEVICE_CODE.camera, DEVICE_CODE.lamp, DEVICE_CODE.centralized];
    return arr.sort((prev, next) => {
      return arrSort.indexOf(prev.code) - arrSort.indexOf(next.code);
    });
  }

  public static equipmentTypeSort(arr) {

  }
}
