import {Pipe, PipeTransform} from '@angular/core';
import {DeptLevel} from '../../user.config';

@Pipe({
  name: 'deptStyle'
})
export class DeptStylePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let style;
    switch (value) {
      case DeptLevel.DEPT_LEVEL_ONE:
        style = 'level-one';
        break;
      case  DeptLevel.DEPT_LEVEL_TWO:
        style = 'level-two';
        break;
      case  DeptLevel.DEPT_LEVEL_THREE:
        style = 'level-three';
        break;
      case  DeptLevel.DEPT_LEVEL_FOUR:
        style = 'level-four';
        break;
      case  DeptLevel.DEPT_LEVEL_FIVE:
        style = 'level-five';
        break;
    }
    return style;
  }

}
