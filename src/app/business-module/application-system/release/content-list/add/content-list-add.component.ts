import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import {ApplicationService} from '../../../server';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {pictureFormat, videoFormat, calculationFileSize} from '../../../model/const/const';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {ClearWorkOrderModel} from '../../../../index/shared/model/work-order-condition.model';

/**
 * 内容新增/编辑页面
 */
@Component({
  selector: 'app-content-list-add',
  templateUrl: './content-list-add.component.html',
  styleUrls: ['./content-list-add.component.scss']
})
export class ContentListAddComponent implements OnInit, AfterViewInit {
  /**
   * 表单中的上传文件
   */
  @ViewChild('upload') upload;
  /**
   * 页面标题
   */
  public pageTitle: string = '新增内容';
  /**
   * 列表初始加载图标
   */
  public isLoading = false;
  /**
   * form表单配置
   */
  public formColumn: FormItem[] = [];
  /**
   * 表单状态
   */
  private formStatus: FormOperate;
  /**
   * 节目文件
   */
  private programFile: any;
  /**
   * 是否是编辑或者新增 false: add true: update
   */
  private isUpdateOrAdd: boolean = false;
  /**
   * 节目ID
   */
  private programId: string;

  /**
   *
   * @param $applicationService 后台接口服务
   * @param $message 提示信息服务
   * @param $router 路由跳转服务
   * @param $activatedRoute 路由传参服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
  ) {
    this.$activatedRoute.queryParams.subscribe(params => {
      if (params.programId) {
        this.programId = params.programId;
        this.isUpdateOrAdd = true;
        this.pageTitle = '编辑内容';
      }
    });
  }

  ngOnInit(): void {
    this.initColumn();
  }

  ngAfterViewInit(): void {
    if (this.isUpdateOrAdd) {
      this.onInitialization();
    }
  }

  public formInstance(event): void {
    this.formStatus = event.instance;
  }

  /**
   * 编辑初始化
   */
  private onInitialization(): void {
    this.$applicationService.lookReleaseProgram(this.programId).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      if (result.code === '00000') {
        this.formStatus.resetData(result.data);
      }
    }, () => {

    });
  }

  /**
   * 表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        label: '节目名称',
        key: 'programName',
        type: 'input',
        require: true,
        disabled: false,
        rule: [
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
        ],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              return Observable.create(observer => {
                observer.next(null);
                observer.complete();
              });
            },
            asyncCode: 'duplicated', msg: '输入错误!'
          }
        ],

      },
      {
        label: '节目描述',
        key: 'programPurpose',
        type: 'input',
        require: true,
        disabled: false,
        placeholder: '描述该节目内容用途',
        rule: [
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
        ],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              return Observable.create(observer => {
                observer.next(null);
                observer.complete();
              });
            },
            asyncCode: 'duplicated', msg: '输入错误!'
          }
        ],
      },
      {
        label: '时长',
        key: 'duration',
        type: 'input',
        require: true,
        disabled: false,
        placeholder: '上传文件自动获取',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '格式',
        key: 'mode',
        type: 'input',
        require: true,
        disabled: false,
        placeholder: '上传文件自动获取',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '分辨率',
        key: 'resolution',
        type: 'input',
        require: true,
        disabled: false,
        placeholder: '上传文件自动获取',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '大小',
        key: 'programSize',
        type: 'input',
        require: true,
        disabled: false,
        placeholder: '上传文件自动获取',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '申请人',
        key: 'applyUser',
        type: 'input',
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '添加人',
        key: 'autoFill',
        type: 'input',
        placeholder: '后台自动填充',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '添加时间',
        key: 'autoFill',
        type: 'input',
        placeholder: '后台自动填充',
        require: true,
        disabled: false,
        rule: [{minLength: 0}, {maxLength: 255}]
      },
      {
        label: '节目文件',
        key: 'programFile',
        type: 'custom',
        require: true,
        rule: [],
        asyncRules: [],
        template: this.upload
      },
      {
        label: '备注',
        disabled: false,
        key: 'remark',
        type: 'input',
        rule: [{minLength: 0}, {maxLength: 255}]
      },
    ];
  }

  /**
   * 提交方法
   */
  public onConfirm(): void {
    const data = this.formStatus.group.getRawValue();
    const requestParameter = new FormData();
    data.file = this.programFile;
    Object.keys(data).forEach(item => {
      if (data[item]) {
        requestParameter.append(item, data[item]);
      }
    });
    let request = this.$applicationService.addReleaseProgram(requestParameter);
    // 判断是否为编辑
    if (this.isUpdateOrAdd) {
      requestParameter.append('programId', this.programId);
      request = this.$applicationService.editReleaseProgram(requestParameter);
    }
    request.subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      if (result.code === '00000') {
        this.$router.navigate(['business/application/release/content-list'], {}).then();
      }
    }, () => {

    });
  }

  /**
   * 文件上传
   */
  public onUploadClick(): void {
    const inputNode = document.createElement('input');
    inputNode.type = 'file';
    inputNode.onchange = () => {
      // 判断文件是否存在
      if (_.isEmpty(inputNode) && !inputNode['files'][0]) {
        this.$message.warning('请从新上传文件' + '!');
        return;
      }
      // 文件大小
      const fileSize: Number = inputNode['files'][0].size / calculationFileSize.mb;
      this.formStatus.group.controls['programSize'].reset(fileSize.toFixed(2) + 'MB');
      // 文件格式
      const fileName = inputNode['files'][0].name.lastIndexOf('.');
      const lastName = inputNode['files'][0].name.substring(fileName, inputNode['files'][0].name.length);
      // 判断大小 10MB
      if (fileSize < 10) {
        // 判断是否为视频
        if (videoFormat[lastName] !== undefined) {
          this.formStatus.group.controls['mode'].reset('视频');
          const videoSrc = window.URL.createObjectURL(inputNode['files'][0]);
          const video = document.createElement('video');
          video.src = videoSrc;
          video.oncanplay = (() => {
            // 获取 时长(取整) 分辨率
            const duration = Math.floor(video.duration) + '秒';
            const resolution = video.videoWidth + '*' + video.videoHeight;
            // 将时长  分辨率set到表单中
            this.formStatus.group.controls['duration'].reset(duration);
            this.formStatus.group.controls['resolution'].reset(resolution);
            // 将文件赋值给全局变量programFile 以供提交使用
            this.programFile = inputNode['files'][0];
          });
          // 判断是否为图片
        } else if (pictureFormat[lastName] !== undefined) {
          this.formStatus.group.controls['mode'].reset('图片');
          // 如果为图片  时长为0
          this.formStatus.group.controls['duration'].reset('0');
          const imageSrc = window.URL.createObjectURL(inputNode['files'][0]);
          const image = document.createElement('img');
          image.src = imageSrc;
          image.onload = (() => {
            const resolution = image.width + '*' + image.height;
            this.formStatus.group.controls['resolution'].reset(resolution);
            // 将文件赋值给全局变量programFile 以供提交使用
            this.programFile = inputNode['files'][0];
          });
        } else {
          this.$message.warning('请上传视频或图片' + '!');
        }
      } else {
        this.$message.warning('请上传小于10MB的文件' + '!');
      }
    };
    inputNode.click();
  }

  /**
   * 取消
   */
  public onCancel(): void {
    window.history.go(-1);
  }
}
