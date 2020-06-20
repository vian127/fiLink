import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ResultModel} from '../../../../core-module/model/result.model';
import {ClearWorkOrderModel} from '../../../index/shared/model/work-order-condition.model';
import {QueryCondition} from '../../../../shared-module/entity/queryCondition';
import {ApplicationService} from '../../server';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';


@Component({
  selector: 'app-split-screen',
  templateUrl: './split-screen.component.html',
  styleUrls: ['./split-screen.component.scss']
})
export class SplitScreenComponent implements OnInit, AfterViewInit {
  /**
   * 设备列表数据
   */
  public equipmentData: any = {
    equipmentList: [],
    paging: {}
  };
  /**
   * 分屏 one:1-1屏(默认)  two:2-2屏 three:3-3屏 four:4-4屏
   */
  public splitScreen: string = 'one';

  /**
   * 屏幕数据
   */
  public screenData: any = [];
  /**
   * 设备列表查询条件
   */
  private queryCondition: QueryCondition = new QueryCondition();

  /**
   * 设备ID 父组件需要
   */
  public equipmentId: string;

  /**
   * 搜索框绑定值
   */
  public searchValue: string;

  /**
   * @param $applicationService 后台服务
   * @param $message 提示信息服务
   */
  constructor(
    private $applicationService: ApplicationService,
    private $message: FiLinkModalService
  ) {
  }

  ngOnInit() {
    this.screenData = [
      {
        src: '/i/movie.ogg'
      }
    ];
    console.log(this.equipmentData);
  }

  ngAfterViewInit(): void {
    this.onInitialization();
  }

  /**
   * 初始化列表
   */
  private onInitialization(): void {
    this.$applicationService.equipmentListByPage(this.queryCondition)
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        // if (result.code) {
        console.log(result);
        this.equipmentData.equipmentList = result.data;
        this.equipmentData.paging.size = result.size;
        this.equipmentData.paging.totalCount = result.totalCount;
        this.equipmentData.paging.pageNum = result.pageNum;
        this.equipmentData.paging.totalPage = result.totalPage;
        // 给equipmentList加上状态 用于样式 是否被选择
        this.equipmentData.equipmentList.forEach(item => {
          item.state = false;
        });
        this.equipmentData.equipmentList[0].state = true;
        this.equipmentId = this.equipmentData.equipmentList[0].equipmentId;
        this.getSecurityConfiguration(this.equipmentData.equipmentList[0].equipmentId);
        // }
      });
  }

  /**
   * 分割视图
   * @param several 分割级别
   */
  splitView(several: any) {

    // 如果当前等级与several相同  则直接return不做操作
    if (this.splitScreen === several) {
      return;
    }

    this.splitScreen = several;
    this.screenData = [];
    switch (several) {
      case 'one':
        for (let i = 0; i < 1; i++) {
          this.screenData.push({src: '/i/movie.ogg'});
        }
        break;
      case 'two':
        for (let i = 0; i < 4; i++) {
          this.screenData.push({src: '/i/movie.ogg'});
        }
        break;
      case 'three':
        for (let i = 0; i < 9; i++) {
          this.screenData.push({src: '/i/movie.ogg'});
        }
        break;
      case 'four':
        for (let i = 0; i < 16; i++) {
          this.screenData.push({src: '/i/movie.ogg'});
        }
        break;
    }
  }


  /***
   * 获取配置信息
   * @param equipmentId 设备ID
   */
  private getSecurityConfiguration(equipmentId): void {
    this.$applicationService.getSecurityConfiguration(equipmentId)
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        if (result.code === 'Z0002') {
          this.$message.warning(result.msg + '请填写基础配置' + '!');
        } else if (result.code === '00000') {
          this.getSecurityCamera();
        }
      });
  }

  /**
   * 获取视频流地址
   */
  private getSecurityCamera(): void {
    const getSecurityCameraParameter = {
      equipmentId: this.equipmentId,
      ip: '1',
      port: '1',
      cameraAccount: '1',
      cameraPassword: '1',
      channel: '1',
      lUserId: '1',
    };
    this.$applicationService.getSecurityCamera(getSecurityCameraParameter)
      .subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
        // if (result.code) {

        // }
      });
  }

  /**
   * 切换列表
   * @param index 列表下标
   */
  public changeEquipment(index): void {

    this.equipmentId = this.equipmentData.equipmentList[index].equipmentId;
    this.getSecurityConfiguration(this.equipmentData.equipmentList[index].equipmentId);

    switch (this.splitScreen) {
      case  'one':
        this.equipmentData.equipmentList.forEach(item => {
          item.state = false;
        });
        this.equipmentData.equipmentList[index].state = true;
        break;
      case 'two':
        this.canBeSelected(index, 4);
        break;
      case 'three':
        this.canBeSelected(index, 9);
        break;
      case 'four':
        this.canBeSelected(index, 16);
        break;
    }

  }

  /**
   * 被选中的数量
   */
  private selectedNum() {
    let count = 0;
    this.equipmentData.equipmentList.forEach(item => {
      if (item.state) {
        count++;
      }
    });
    return count;
  }

  /**
   * 能否被选中
   * @param index 下标
   * @param num 可以选中的数量
   */
  private canBeSelected(index: number, num: number) {
    if (this.equipmentData.equipmentList[index].state) {
      this.equipmentData.equipmentList[index].state = false;
    } else if (this.selectedNum() < num) {
      this.equipmentData.equipmentList[index].state = true;
    } else {
      this.$message.warning(`选中的数量不能超过${num}个` + '!');
    }
  }

  /**
   * 分页事件
   * @param pageNum 返回页码
   */
  public nzPageIndexChange(pageNum: number): void {
    this.queryCondition.pageCondition.pageNum = pageNum;
    this.onInitialization();
  }

  /**
   * 搜索方法
   */
  public search() {
    this.queryCondition.filterConditions = [{filterValue: this.searchValue, filterField: 'equipmentName', operator: 'like'}];
    this.onInitialization();
  }
}
