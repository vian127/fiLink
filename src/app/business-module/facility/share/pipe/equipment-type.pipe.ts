import {Pipe, PipeTransform} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {Option} from '../../../../shared-module/component/check-select-input/check-select-input.component';
import {FacilityUtilService} from '../../share/service/facility-util.service';

/**
 * 设备类型管道
 */
@Pipe({
  name: 'equipmentType'
})
export class EquipmentTypePipe implements PipeTransform {
  constructor(private $nzI18n: NzI18nService,
              private $facilityUtilService: FacilityUtilService) {
  }
  transform(value: any): string {
    const equipmentTypeList = this.$facilityUtilService.getEquipmentType(this.$nzI18n).map(item => {
      const obj: Option = {
        label: '',
        value: ''
      };
      obj.label = item.label;
      obj.value = item.code;
      return obj;
    });
    if (value && !_.isEmpty(equipmentTypeList)) {
      const list = equipmentTypeList.filter(item => item.value === value);
      if (list.length > 0) {
        return list[0].label;
      } else {
        return null;
      }
    }
    return null;
  }
}
