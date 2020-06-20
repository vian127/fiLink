import {Pipe, PipeTransform} from '@angular/core';
import {AreaLevel} from '../../share/const/facility.config';

@Pipe({
  name: 'areaStyle'
})
export class AreaStylePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let style;
    switch (value) {
      case AreaLevel.AREA_LEVEL_ONE:
        style = 'level-one';
        break;
      case AreaLevel.AREA_LEVEL_TWO:
        style = 'level-two';
        break;
      case AreaLevel.AREA_LEVEL_THREE:
        style = 'level-three';
        break;
      case AreaLevel.AREA_LEVEL_FOUR:
        style = 'level-four';
        break;
      case AreaLevel.AREA_LEVEL_FIVE:
        style = 'level-five';
        break;
    }
    return style;
  }

}
