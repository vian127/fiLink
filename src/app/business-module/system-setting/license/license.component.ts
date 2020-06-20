import {Component, OnInit} from '@angular/core';
import {BasicConfig} from '../../basic-config';
import {NzI18nService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../column-config.service';
import {LicenseService} from '../../../core-module/api-service/system-setting/license/license.service';
import {Result} from '../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent extends BasicConfig implements OnInit {

  constructor(public $nzI18n: NzI18nService,
              private $licenseService: LicenseService,
              private $message: FiLinkModalService,
              private $columnConfigService: ColumnConfigService) {
    super($nzI18n);
  }

  ngOnInit() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSizeChanger: true,
      noIndex: true,
      scroll: {x: '600px', y: '325px'},
      columnConfig: this.$columnConfigService.getLicenseColumnConfig({}),
      bordered: false,
      topButtons: [{
        text: this.language.systemSetting.uploadLicense,
        permissionCode: '04-6-1',
        className: 'upload-button',
        handle: () => {
          this.uploadClick();
        }
      }]
    };
    this.searchList();
  }

  /**
   * license列表查询
   */
  searchList() {
    this.tableConfig.isLoading = true;
    this.$licenseService.getLicenseDetail().subscribe((result: Result) => {
      this.tableConfig.isLoading = false;
      if (result.code === 0) {
        this._dataSet = result.data;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 文件上传
   */
  uploadClick() {
    const inputNode = document.createElement('input');
    inputNode.type = 'file';
    inputNode.onchange = () => {
      const fileSize = inputNode['files'][0].size / 1024 / 1024;
      if (fileSize < 1) {
        const reg = /.xml$/;
        if (reg.test(inputNode['files'][0].name)) {
          this.uploadFile(inputNode['files'][0]);
        } else {
          this.$message.warning(this.language.agreement.currentlyOnlyXMLFormatFilesAreSupported + '!');
        }
      } else {
        this.$message.warning(this.language.agreement.fileSizeLessThan1M);
      }
    };
    inputNode.click();
  }

  /**
   * 文件上传
   * param file
   */
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    this.$licenseService.uploadLicense(formData).subscribe((result: Result) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.searchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
