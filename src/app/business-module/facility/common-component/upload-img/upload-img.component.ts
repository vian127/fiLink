import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NzI18nService, UploadFile} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {filter} from 'rxjs/operators';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {fileTypeConst} from '../../share/const/facility-common.const';

@Component({
  selector: 'upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.scss']
})
export class UploadImgComponent implements OnInit, OnDestroy {

  @Input()
  public url: string;
  // 国际化
  public language: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 所选文件集合
  public fileList = [];
  // 图片url
  public imgUrl: SafeUrl;
  public formData = new FormData();
  public previewVisible = false;
  public previewUrl: string | SafeUrl;
  public fileType = fileTypeConst;
  @ViewChild('upload') upload;

  constructor(private $nzI18n: NzI18nService,
              private $httpClient: HttpClient,
              private sanitizer: DomSanitizer,
              private $message: FiLinkModalService) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.commonLanguage = this.$nzI18n.getLocaleData('common');
    if (this.url) {
      this.imgUrl = this.sanitizer.bypassSecurityTrustUrl(this.url);
      this.upload.nzFileList = [
        {
          uid: ' ',
          url: this.url,
          status: 'success'
        }
      ];
    }
  }

  public beforeUpload = (file: UploadFile): boolean => {
    if (!this.fileType.includes(file.type)) {
      this.$message.error('图片格式不正确');
      return false;
    }
    const isLt100K = file.size / 1024 < 100;
    if (!isLt100K) {
      this.$message.error('图片大小不能超过100K!');
      return false;
    }

    this.imgUrl = this.getObjectURL(file);
    this.fileList = [];
    file.url = this.imgUrl['changingThisBreaksApplicationSecurity'] as string;
    file.status = 'success';
    this.fileList = this.fileList.concat(file);
    this.upload.nzFileList = this.fileList;
    setTimeout(() => {
      this.removeUnsafe();
    });
    return false;
  }

  public handleUpload(uploadUrl): boolean {
    if (_.isEmpty(this.fileList)) {
      return;
    }
    this.formData.append('pic', this.fileList[0]);
    this.formData.append('resource', '3');
    const req = new HttpRequest('POST', uploadUrl, this.formData, {});
    this.$httpClient
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        response => {
          this.fileList = [];
          return true;
        },
        error => {
          return false;
        }
      );
  }

  public handlePreview = async (file: UploadFile) => {
    this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(file.url);
    this.previewVisible = true;
  };

  public ngOnDestroy(): void {
    this.imgUrl = '';
  }

  // 生成一个预览图片安全url
  private getObjectURL(file): SafeUrl {
    const imgUrl = window.URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  private removeUnsafe(): void {
    const elementsByTagName = document.getElementsByTagName('img');
    for (let i = 0; i < elementsByTagName.length; i++) {
      if (elementsByTagName[i].src.includes('unsafe:')) {
        const newSrc = elementsByTagName[i].src.slice(7);
        elementsByTagName[i].setAttribute('src', newSrc);
      }
    }
  }

}
