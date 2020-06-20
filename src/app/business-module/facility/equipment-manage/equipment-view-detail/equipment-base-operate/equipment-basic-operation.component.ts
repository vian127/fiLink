import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {binarySystemConst, fileTypeConst, imgSizeConst, objectTypeConst, resourceConst} from '../../../share/const/facility-common.const';
import {HttpClient} from '@angular/common/http';
import {equipmentServiceUrlConst} from '../../../share/const/equipment-service-url.const';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';

/**
 * 设施详情操作按钮组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-basic-operation',
  templateUrl: './equipment-basic-operation.component.html',
  styleUrls: ['./equipment-basic-operation.component.scss']
})
export class EquipmentBasicOperationComponent implements OnInit {
  //  入参设备id
  @Input()
  public equipmentId: string = '';
  @Input()
  public equipmentType: string = '';
  // 设备管理国际化
  public language: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $http: HttpClient,
    private $router: Router,
    private $modalService: NzModalService,
    private $equipmentApiService: EquipmentApiService
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
  }

  /**
   * 上传之前判断文件格式和大小
   */
  beforeUpload = (file: UploadFile): boolean => {
    if (!fileTypeConst.includes(file.type)) {
      this.$message.error(this.language.fileFormatError);
      return false;
    }
    const isLt100K = file.size / binarySystemConst < imgSizeConst;
    if (!isLt100K) {
      this.$message.error(this.language.pictureTooLarge);
      return false;
    }
  }
  /**
   * 上传文件
   */
  uploadImg = (item) => {
    const formData = new FormData();
    formData.append('resource', resourceConst);
    formData.append('pic', item.file);
    formData.append('objectId', this.equipmentId);
    formData.append('objectType', objectTypeConst.equipment);
    this.$http.post(equipmentServiceUrlConst.uploadImageForLive, formData)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 点击编辑设施按钮
   */
  public onClickEditButton(): void {
    this.$router.navigate(['business/facility/equipment-detail/update'],
      {queryParams: {equipmentId: this.equipmentId}}).then();
  }

  /**
   * 点击删除按钮
   */
  public onClickDelete(): void {
    this.$modalService.confirm({
      nzTitle: this.language.confirmDeleteData,
      nzCancelText: this.commonLanguage.confirm,
      nzOkText: this.commonLanguage.cancel,
      nzOnOk: () => {
        this.$equipmentApiService.deleteEquipmentByIds([this.equipmentId]).subscribe(
          (res: ResultModel<string>) => {
            if (res.code === ResultCodeEnum.success) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    });
  }
}
