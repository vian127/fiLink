import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {Result} from '../../../../shared-module/entity/result';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {InspectionService} from '../../../../core-module/api-service/work-order/inspection';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-select-inspection-template',
  templateUrl: './select-inspection-template.component.html',
  styleUrls: ['./select-inspection-template.component.scss']
})
export class SelectInspectionTemplateComponent implements OnInit {
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  @Input() modalParams;
  // 国际化
  public language: InspectionLanguageInterface;
  // 列表数据
  public listData = [];
  // 模板数据
  public  templateList = [];
  // radio值
  public radioValue = '';
  // 当前选择的模板
  public selectTemplateData: any;
  // 全选
  public allChecked = false;
  public indeterminate = true;
  // 被编辑的id
  public editId: string | null;
  // 上次操作
  public lastInspection;
  // 显示隐藏
  public _xcVisible = false;
  // 输入巡检项
  public inputItemValue = '';
  // 输入备注
  public inputRemarkValue: string;
  // 是否添加
  public isCreat: boolean = true;
  get xcVisible() {
    return this._xcVisible;
  }
  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }
  constructor(
    public $nzI18n: NzI18nService,
    public $inspectionService: InspectionService,
    public $message: FiLinkModalService,
  ) { }

  ngOnInit() {
    this.getTemplateList();
    this.language = this.$nzI18n.getLocaleData('inspection');
    this.selectTemplateData = this.modalParams.selectTemplateData;
    if (this.modalParams && this.modalParams.pageType === 'update') {
      this.listData = this.modalParams.selectTemplateData.inspectionTemplateItemList;
      this.radioValue = this.modalParams.selectTemplateData.templateId;
      // this.getTemplateDetail(this.radioValue, '');
    }
  }
  handleCancel() {
    this.xcVisible = false;
  }
  handleOk() {
    if (this.listData.length > 0) {
      let sum = 0;
      this.listData.forEach(v => {
        if (v.checked) {
          sum++;
        }
      });
      if (sum === 0) {
        this.$message.error(this.language.chooseItem);
        return;
      }
      this.selectTemplateData.inspectionTemplateItemList = this.listData;
      this.selectTemplateData['inspectionItemList'] = this.listData;
      this.selectDataChange.emit(this.selectTemplateData);
      this.handleCancel();
    }
  }
  /**
   * 获取巡检模板数据
   */
  getTemplateList() {
    // 列表数据 listData  模板数据  templateList
    this.$inspectionService.selectTemplate({}).subscribe((result: Result) => {
      if (result.code === 0) {
        if (result.data.length > 0) {
          this.templateList = result.data ? result.data : [];
          if (this.selectTemplateData) {
            this.radioValue = this.selectTemplateData.templateId;
            this.getTemplateDetail(this.radioValue, '');
          } else {
            this.radioValue = result.data[0].templateId;
            this.getTemplateDetail(result.data[0].templateId, '');
          }
        }
      }
    }, () => { });
  }
  getTemplateDetail(templateId, type) {
    this.$inspectionService.getTemplateInfo(templateId).subscribe((result: Result) => {
      if (result.code === 0) {
        this.listData = [];
        // this.selectTemplateData = null;
        this.selectTemplateData = result.data;
        const list = result.data.inspectionTemplateItemList ? result.data.inspectionTemplateItemList : [];
        if (this.modalParams.pageType === 'update' && type === '' && this.modalParams.selectTemplateData) {
          const arr = this.modalParams.selectTemplateData.inspectionItemList;
          for (let i = 0; i < list.length; i++) {
            for (let k = 0; k < arr.length; k++) {
              if (arr[k].templateItemId === list[i].templateItemId) {
                list[i]['checked'] = true;
                continue;
              }
            }
          }
          if (arr.length === list.length) {
            this.allChecked = true;
          }
          list.forEach(v => {
            if (!v.checked) {
              v['checked'] = false;
            }
          });
        } else {
          if (this.modalParams.selectTemplateData) {
            const arr = this.modalParams.selectTemplateData.inspectionItemList;
            for (let i = 0; i < list.length; i++) {
              for (let k = 0; k < arr.length; k++) {
                if (arr[k].templateItemId === list[i].templateItemId && arr[k].checked) {
                  list[i]['checked'] = true;
                  continue;
                }
              }
            }
          } else {
            this.selectTemplateData = result.data;
            list.forEach(v => {
              v['checked'] = false;
            });
          }
        }
        this.listData = list;
        this.lastEdit();
      }
    }, () => { });
  }

  /**
   * 全选
   */
  updateAllChecked() {
    this.indeterminate = false;
    this.lastInspection = [];
    if (this.allChecked) {
      this.listData = this.listData.map(item => {
        this.lastInspection.push(item);
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.listData = this.listData.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }
  }

  /**
   * 行内复选框
   */
  updateSingleChecked(data) {
    if (this.listData.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.listData.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    if (data.checked) {
      this.lastInspection.push(data);
    } else {
      this.lastInspection.forEach((v, index) => {
        if (data.templateItemId === v.templateItemId) {
          this.lastInspection.splice(index, 1);
        }
      });
    }
  }

  /**
   * 添加行
   */
  addTemplateRow() {
    const templateId = CommonUtil.getUUid();
    this.editId = templateId;
    let isTrue = false;
    if (this.allChecked) {
      isTrue = true;
    }
    if (this.inputItemValue === '') {
      this.$message.error(this.language.pleaseEnterInspectItem);
      return;
    }
    this.listData.push({
      remark: this.inputRemarkValue,
      sort: this.listData.length + 1,
      templateItemId: templateId,
      templateItemName: this.inputItemValue,
      isAdd: true,
      checked: isTrue,
    });
    if (this.allChecked && this.inputItemValue) {
      this.lastInspection.push({
        templateItemId: CommonUtil.getUUid(),
        templateItemName: this.inputItemValue
      });
    }
    this.inputItemValue = '';
    this.inputRemarkValue = '';
  }

  /**
   * 删除行
   */
  deleteRow(templateItemId) {
    for (let i = 0; i < this.listData.length; i++) {
      if (this.listData[i].templateItemId === templateItemId) {
        this.listData.splice(i, 1);
        break;
      }
    }
  }

  /**
   * 删除已选择巡检项
   */
  deleteItem(item, index) {
    this.lastInspection.splice(index, 1);
    this.listData.forEach(v => {
      if (v.templateItemId === item.templateItemId) {
        v.checked = false;
      }
    });
  }

  /***
   * 编辑
   */
  editTemplate(item) {
    if (item.isAdd) {
      this.editId = item.templateItemId;
    }
  }
  /**
   * 上次操作内容
   */
  lastEdit() {
    this.lastInspection = [];
    let list = [];
    if (this.modalParams.selectTemplateData) {
      list = this.modalParams.selectTemplateData.inspectionItemList;
      list.forEach(v => {
        if (v.checked) {
          this.lastInspection.push({
            templateItemId: v.templateItemId,
            templateItemName: v.templateItemName
          });
        }
      });
    }
  }
  /**
   * 已有模板选择
   */
  selectValue() {
    this.getTemplateDetail(this.radioValue, 'select');
    this.allChecked = false;
  }

  /**
   * 添加行数据
   */
  saveRow() {
    this.isCreat = true;
  }

  /**
   * 关闭新增
   */
  closeAdd() {
    this.isCreat = false;
  }
}
