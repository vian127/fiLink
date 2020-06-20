import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ColumnConfigService} from '../../column-config.service';
import {NzI18nService} from 'ng-zorro-antd';
import {AgreementManageService} from '../../../../core-module/api-service/system-setting/agreement-manage/agreement-manage.service';
import {Result} from '../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {BasicConfig} from '../../../basic-config';
import {FormBuilder} from '@angular/forms';
import {Download} from '../../../../shared-module/util/download';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {MenuManageService} from '../../../../core-module/api-service/system-setting';
import {XmlLimitConfig} from '../../enum/systemConfig';
/**
 * 设施协议
 */
@Component({
  selector: 'app-facility-agreement',
  templateUrl: './facility-agreement.component.html',
  styleUrls: ['./facility-agreement.component.scss']
})
export class FacilityAgreementComponent extends BasicConfig implements OnInit {
  // 标题
  public title = this.language.agreement.addFacilityProtocol;
  // 新增弹出框显示隐藏
  public  isVisible = false;
  // 协议名称
  public agreementName: '';
  // 文件名称
  public fileName: '';
  // 上传的文件
  public file: any;
  // 协议id
  public protocolId = '';
  // 分页
  public pageBean: PageBean = new PageBean(10, 1, 1);
  // 查询条件
  public queryConditions: QueryCondition = new QueryCondition();
  // xml文件校验
  public limit = {
    nameLength: XmlLimitConfig.nameLength,
    size: XmlLimitConfig.size,
    nameI18n: this.language.agreement.fileNameLengthLessThan32bits,
    sizeI18n: this.language.agreement.fileSizeLessThan1M
  };
  // 弹出框底部
  @ViewChild('tplFooter') public tplFooter;
  // 文件下载
  @ViewChild('fileNameRef') public fileNameRef;
  // 上次脚本文件
  @ViewChild('uploads') private uploadsTemplate: ElementRef;


  constructor(
    public $nzI18n: NzI18nService,
    private $columnConfigService: ColumnConfigService,
    private $agreementManageService: AgreementManageService,
    private $message: FiLinkModalService,
    private fb: FormBuilder,
    private $download: Download,
    private $ruleUtil: RuleUtil,
    private $systemSettingService: MenuManageService
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    // 初始化信息
    const initData = {
      uploads: this.uploadsTemplate,
      protocolId: this.protocolId
    };

    this.formColumn = this.$columnConfigService.agreementConfig(initData);
    this.language = this.$nzI18n.getLocale();
    this.title = this.language.agreement.addFacilityProtocol;

    // 初始化表格
    this.tableConfig = {
      primaryKey: '04-3-1',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showPagination: true,
      showSizeChanger: true,
      scroll: {x: '600px', y: '325px'},
      columnConfig: this.$columnConfigService.getFacilityColumnConfig({
        fileName: this.fileNameRef
      }),
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: '+  ' + this.language.table.add,
          permissionCode: '04-3-1-1',
          handle: () => {
            this.isVisible = true;
            this.agreementName = '';
            this.formStatus.group.controls['agreementName'].clearAsyncValidators();
            this.formStatus.group.controls['agreementName'].setAsyncValidators(
              this.$ruleUtil.getNameAsyncRule(value => this.$systemSettingService.checkDeviceProtocolNameRepeat(
                {protocolId: '', protocolName: value}),
                res => res.code === 0).asyncRule
            );
          }
        }, {
          text: this.language.table.delete,
          btnType: 'danger',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '04-3-1-2',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data) => {
            if (data.length === 0) {
              this.$message.warning(this.language.agreement.pleaseCheckToDeleteTheDataFirst + '!');
              return;
            }
            const ids = data.map(item => item.protocolId);
            this.deleteFacility(ids);
          }
        }
      ],
      sort: (e) => {
        this.queryConditions.sortCondition = e;
        this.searchList();
      },
      handleSearch: (event) => {
        this.queryConditions.pageCondition.pageNum = 1;
        this.handleSearch(event);
      },
      operation: [
        {
          text: this.language.facility.update,
          permissionCode: '04-3-1-2',
          className: 'fiLink-edit',
          handle: (current) => {
            this.title = this.language.agreement.updateFacilityProtocol;
            this.isVisible = true;
            this.fileName = current.fileName;
            this.agreementName = current.protocolName;
            this.protocolId = current.protocolId;
            this.formStatus.group.controls['agreementName'].clearAsyncValidators();
            this.formStatus.group.controls['agreementName'].setAsyncValidators(
              this.$ruleUtil.getNameAsyncRule(value => this.$systemSettingService.checkDeviceProtocolNameRepeat(
                {protocolId: current.protocolId, protocolName: value}),
                res => res.code === 0).asyncRule
            );

            this.formStatus.group.controls['agreementName'].setValue(current.protocolName);
          }
        },
        {
          text: this.language.table.delete,
          className: 'fiLink-delete red-icon',
          permissionCode: '04-3-1-3',
          needConfirm: true,
          handle: (current) => {
            this.deleteFacility([current.protocolId]);
          }
        }],
    };
    this.searchList();
    this.queryLimit();
  }

  pageChange(event) {
    this.queryConditions.pageCondition.pageNum = event.pageIndex;
    this.queryConditions.pageCondition.pageSize = event.pageSize;
    this.searchList();
  }

  /**
   * 查询设施协议文件规格
   */
  queryLimit() {
    this.$agreementManageService.queryFileLimit().subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this.limit = result.data;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 查询设施协议列表
   */
  searchList() {
    this.tableConfig.isLoading = true;
    this.$agreementManageService.queryDeviceProtocolList(this.queryConditions).subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this._dataSet = result.data;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 删除设施协议
   * param protocolIds
   */
  deleteFacility(protocolIds) {
    this.$agreementManageService.deleteDeviceProtocol(protocolIds).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.searchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 隐藏弹出框
   */
  modalCancel() {
    // 初始化信息
    this.isVisible = false;
    this.agreementName = '';
    this.fileName = '';
    this.file = null;
    this.protocolId = '';
    this.title = this.language.agreement.addFacilityProtocol;
    this.formStatus.group.controls['agreementName'].setValue('');
    this.formStatus.resetData({});
  }

  /**
   * 文件上传
   */
  upload() {
    const fileNode = document.getElementById('file');
    fileNode.click();
  }

  /**
   * 文件变化
   */
  fileChange($event) {
    // 文件名效验
    const fileNode = document.getElementById('file');
    const fileName = fileNode['files'][0].name;
    const reg = /.xml$/;
    if (reg.test(fileName)) {
      this.file = fileNode['files'][0];
      if (this.file.name.length <= this.limit.nameLength) {
        if (this.file.size <= this.limit.size) {
          this.fileName = this.file.name;
          this.$message.info(this.language.agreement.uploadSuccess);
        } else {
          this.errorFile(this.limit.sizeI18n, $event);
        }
      } else {
        this.errorFile(this.limit.nameI18n, $event);
      }
    } else {
      this.$message.warning(this.language.agreement.currentlyOnlyXMLFormatFilesAreSupported + '!');
    }
  }

  /**
   * 文件错误提示
   */
  errorFile(msg, event) {
    this.fileName = '';
    this.file = null;
    event.target.value = '';
    this.$message.warning(msg + '!');
  }

  /**
   * 点击确认按钮
   */
  submit() {
    if (!this.protocolId) {
      // 新增
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('protocolName', this.formStatus.group.controls['agreementName'].value);
      this.submitLoading = true;
      this.$agreementManageService.addDeviceProtocol(formData).subscribe((result: Result) => {
        this.submitLoading = false;
        if (result.code === 0) {
          this.$message.success(result.msg);
          this.modalCancel();
          this.searchList();
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.submitLoading = false;
      });
    } else {
      // 修改
      let sendData = null;
      let funcName = '';
      if (this.file) {
        funcName = 'updateDeviceProtocol';
        sendData = new FormData();
        sendData.append('file', this.file);
        sendData.append('protocolId', this.protocolId);
        sendData.append('protocolName', this.formStatus.group.controls['agreementName'].value);
      } else {
        funcName = 'updateProtocolName';
        sendData = {
          protocolId: this.protocolId,
          protocolName: this.formStatus.group.controls['agreementName'].value
        };
      }
      this.submitLoading = true;
      this.$agreementManageService[funcName](sendData).subscribe((result: Result) => {
        this.submitLoading = false;
        if (result.code === 0) {
          this.$message.success(result.msg);
          this.modalCancel();
          this.searchList();
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.submitLoading = false;
      });
    }
  }

  /**
   * 文件下载
   * param item
   */
  download(item) {
    this.$download.downloadFile(item.fileDownloadUrl, item.fileName);
  }
}
