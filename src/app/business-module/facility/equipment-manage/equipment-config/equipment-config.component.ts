import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormItem} from '../../../../shared-module/component/form/form-config';

/**
 * 设备配置组件
 */
@Component({
  selector: 'app-equipment-config',
  templateUrl: './equipment-config.component.html',
  styleUrls: ['./equipment-config.component.scss']
})
export class EquipmentConfigComponent implements OnInit {
  // 模拟后台配置数据
  // columnData = []
  // 表单配置数据
  public formColumnData = [];
  // 设备id
  public equipmentId: string;
  // 没有数据
  public noDataShow = false;
  // 校验信息是否通过
  public checkedInfo = true;
  // 参数配置值
  public pramsConfigData: any = [];

  constructor(
    private $active: ActivatedRoute,
  ) {
  }

  /**
   * 初始化
   */
  ngOnInit(): void {
    this.$active.queryParams.subscribe(params => {
      this.equipmentId = params.id;
      // 获取表单html
      this.getPramsConfig();
    });


  }


  /**
   * 获取参数配置
   */
  public getPramsConfig(): void {
    this.noDataShow = true;
    // this.pramsConfigData = this.columnData || [];
    this.pramsConfigData.forEach((item: any) => {
      item.formColumn = this.createFormColumn(item.configParams);
    });
    // this.formColumnData = this.columnData;
    if (this.equipmentId) {
      this.getConfigValue();
    }
  }

  /**
   * 获取参数配置的值
   */
  public getConfigValue(): void {

  }

  /**
   * 创建表单
   * param data
   */
  public  createFormColumn(data): Array<any> {
    const arr = [];
    data.forEach(item => {
      const formItem = new FormItem();
      formItem.key = item.id;
      formItem.type = item.type;
      formItem.label = item.name;
      formItem.col = 24;
      formItem.require = true;
      formItem.rule = item.rules || [];
      if (item.placeholder) {
        formItem.placeholder = item.placeholder;
      }
      if (item.unit) {
        formItem.suffix = item.unit;
      }
      if (formItem.type === 'select') {
        formItem.selectInfo = {
          data: item.selectParams,
          label: 'name',
          value: 'id',
        };
      }
      arr.push(formItem);
    });
    return arr;
  }


  /**
   * 表单实例
   */
  public formInstance(event, index): void {
    this.formColumnData[index]['formInstance'] = event;
    this.formColumnData[index]['formInstance'].instance.group.statusChanges.subscribe(() => {
      this.checkedInfo = this.checked();
    });
  }


  /**
   * 表单验证
   */
  public checked(): boolean {
    let pass = true;
    // 默认通过所有都通过校验
    this.formColumnData.forEach(item => {
      // 如果有一个没有通过校验
      if (item['formInstance'].instance.getValid()) {

      } else {
        pass = false;
      }
    });
    return !pass;
  }


}
