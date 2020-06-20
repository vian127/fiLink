import {Pipe, PipeTransform} from '@angular/core';
import {getAreaLevel} from '../../share/const/facility.config';

@Pipe({
  name: 'areaLevel'
})
export class AreaLevelPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return getAreaLevel(args, value);
    } else {
      return '';
    }
  }

}
