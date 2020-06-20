import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FilterCondition} from '../../../../../shared-module/entity/queryCondition';
import {EquipmentListModel} from '../../../../../core-module/model/equipment-list.model';
import {ResultModel} from '../../../../../core-module/model/result.model';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {ActivatedRoute} from '@angular/router';
import {ResultCodeEnum} from '../../../../../core-module/model/result-code.enum';
import {gatewayConfigImgUrl} from '../../../share/const/loop-const';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {Result} from '../../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormOperate} from '../../../../../shared-module/component/form/form-opearte.service';
import {EquipmentDetailComponent} from '../../equipment-detail/equipment-detail.component';


/**
 * 网关配置组件
 */
@Component({
  selector: 'app-gateway-configuration',
  templateUrl: './gateway-configuration.component.html',
  styleUrls: ['./gateway-configuration.component.scss']
})
export class GatewayConfigurationComponent implements OnInit, OnDestroy {
  // 设备新增组件
  @ViewChild('addEquipmentTemp') public newEquipment: EquipmentDetailComponent;
  // 国际化语言包
  public language: FacilityLanguageInterface;
  public assetsLanguage: AssetManagementLanguageInterface;
  // 新增设备弹框是否显示
  public xcVisible: boolean = false;
  // 修改当前配置弹框是否显示
  public editXcVisible: boolean = false;
  // 显示新增设备底部按钮还是配置底部按钮
  public isAddOrConfig: boolean = true;
  // 引入qunee画布
  public Q = window['Q'];
  public graph;
  // 端口节点
  public portNode: Array<any> = [];
  // 点击未使用的端口出现按钮
  public addButtonPart: boolean = false;
  // 点击使用的端口出现按钮
  public editButtonPart: boolean = false;
  // 已有设备弹框显示
  public existEquipmentVisible: boolean = false;
  // 已有设备过滤条件
  public equipmentFilter: FilterCondition[] = [];
  // 网关id
  public gatewayId: string;
  // 网关名称
  public gatewayName: string = 'testGatewayName';
  // 网关型号
  public gatewayModel: string;
  // 网关端口信息
  public gatewayPortInfo: Array<any>;
  // 已使用的端口使用信息
  public gatewayUsedPortInfo: Array<any>;
  // 已连接端口标识id
  public gatewayPortId: string;
  // 新增设备确定按钮状态
  public isLoading = false;
  // 表单实例
  public formStatus: FormOperate;
  // 表单提交是否可以操作
  public isValid: boolean = false;
  // 已有设备选中数据
  public hasDeviceData;
  // 点击端口序号
  public portNo: number;
  // 和端口相连的设备id
  public usedEquipmentId: string;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    public $activatedRoute: ActivatedRoute,
    private $equipmentAipService: EquipmentApiService,
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData('facility');
    this.assetsLanguage = this.$nzI18n.getLocaleData('assets');
    // qunee画布
    this.graph = new this.Q.Graph('gateway-canvas');
    // 跳转网关信息
    this.$activatedRoute.queryParams.subscribe(params => {
      this.gatewayId = params.id;
      this.gatewayId = 'GpHeZIdtvD2yDL9pbj2';
      this.gatewayName = params.name;
      this.gatewayModel = params.model;
    });
    const gatewayInfo = {
      'gatewayId': 'GpHeZIdtvD2yDL9pbj2',
      'gatewayModel': 'HK120'
    };
    // 请求初始化网关配置信息
    this.initGateWay(gatewayInfo).then(() => {
      // 根据返回信息绘制网关配置界面
      this.drawNodeInfo();
    });
    // 端口点击事件
    this.clickPort();
    // 鼠标拖拽设备节点事件
    this.mouseDragEvent();
  }


  /**
   * 初始化绘制网关配置
   */
  private initGateWay(gatewayInfo: Object) {
    this.gatewayPortInfo = [];
    return new Promise((resolve, reject) => {
      // 网关端口初始化信息
      this.$equipmentAipService.queryGatewayPortInfoTopology(gatewayInfo).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (!_.isEmpty(result.data)) {
            // 初始化网关配置信息存放
            this.gatewayPortInfo = result.data;
          }
          console.log(this.gatewayPortInfo);
          resolve();
        }
      });
    });
  }


  /**
   * 初始化网关配置拓扑页面
   */
  public drawNodeInfo(): void {
    this.portNode = [];
    // 绘制网关节点
    this.createNode(this.gatewayName, -700, -300, 'gateway',
      gatewayConfigImgUrl.gateway, false, 60, 60);
    const portInfo = this.gatewayPortInfo;
    if (portInfo.length) {
      for (let i = 0; i < portInfo.length; i++) {
        // 已经使用的端口状态和图片
        if (portInfo[i].gatewayPortId) {
          portInfo[i].status = true;
          portInfo[i].imgage = gatewayConfigImgUrl.usedPort;
        } else {
          portInfo[i].status = false;
          portInfo[i].imgage = gatewayConfigImgUrl.port;
        }
        // 上排10个端口
        if (i < 10) {
          const portNode = this.createNode(portInfo[i].portName, 100 * i - 500, -50, 'port',
            portInfo[i].imgage, false, 40, 40, portInfo[i].status, portInfo[i].portNo, portInfo[i].portType);
          portNode['$equipmentId'] = portInfo[i].equipmentId;
          if (portNode['$status']) {
            // equipmentPosition = '-550,100';
            const equipmentPosition = portInfo[i].equipmentPosition.split(',');
            const equipmentNodeX = Number(equipmentPosition[0]);
            const equipmentNodeY = Number(equipmentPosition[1]);
            const equipmentNode = this.createNode(portInfo[i].nodeName, equipmentNodeX, equipmentNodeY, 'equipmentNode'
              , gatewayConfigImgUrl.camera, true, 60, 60);
            equipmentNode['$portNo'] = portInfo[i].portNo;
            equipmentNode['$equipmentId'] = portInfo[i].equipmentId;
            equipmentNode['$equipmentType'] = portInfo[i].actualEquipmentType;
            this.createLine(equipmentNode, portNode, portInfo[i].lineName);
          }
          this.portNode.push(portNode);
        } else {
          // 下排端口
          const portNode = this.createNode(portInfo[i].portName, 100 * (i - 10) - 500, 50, 'port',
            portInfo[i].imgage, false, 40, 40, portInfo[i].status, portInfo[i].portNo, portInfo[i].portType);
          if (portNode['$status']) {
            // equipmentPosition = '-550,100';
            const equipmentPosition = portInfo[i].equipmentId.split(',');
            const equipmentNodeX = Number(equipmentPosition[0]);
            const equipmentNodeY = Number(equipmentPosition[1]);
            const equipmentNode = this.createNode(portInfo[i].nodeName, equipmentNodeX, equipmentNodeY, 'equipmentNode'
              , gatewayConfigImgUrl.camera, true, 60, 60);
            equipmentNode['$portNo'] = portInfo[i].portNo;
            equipmentNode['$equipmentId'] = portInfo[i].equipmentId;
            equipmentNode['$equipmentType'] = portInfo[i].actualEquipmentType;
            this.createLine(equipmentNode, portNode, portInfo[i].lineName);
          }
          this.portNode.push(portNode);
        }
      }
    }
  }


  /**
   * 节点放置方法
   */
  public createNode(nodeName, nodeX, nodeY, type, image, move, w, h, status?, portNo?, portType?): void {
    const node = this.graph.createNode(nodeName, nodeX, nodeY);
    node.size = {width: w, height: h};
    node.image = image;
    node.movable = move;
    node['$type'] = type;
    if (type === 'port') {
      // 端口状态和端口序号
      node['$status'] = status;
      node['$portNo'] = portNo;
      node['$portType'] = portType;
    }
    return node;
  }

  /**
   * 连线方法
   */
  public createLine(equipmentNode, portNode, lineName): void {
    const line = this.graph.createEdge(equipmentNode, portNode, lineName);
    line.zIndex = -1;
    line.setStyle(this.Q.Styles.EDGE_COLOR, '#88AAEE');
    line.setStyle(this.Q.Styles.EDGE_WIDTH, 2);
    line.setStyle(this.Q.Styles.ARROW_TO, false);
    line.edgeType = this.Q.Consts.EDGE_TYPE_ORTHOGONAL;
  }

  /**
   * 端口点击按钮事件
   */
  public clickPort(): void {
    this.graph.onclick = (evt) => {
      const getPortObj = evt.getData();
      // 有连接关系端口点击获取连接标识id
      if (getPortObj.gatewayPortId) {
        this.gatewayPortId = getPortObj.$gatewayPortId;
      }
      const buttonMenu = document.getElementById('buttonMenu');
      // 点击类型为端口时，出现对应功能按钮
      if (getPortObj && getPortObj.type && getPortObj.$type === 'port') {
        buttonMenu.style.display = 'block';
        // 已经使用过的端口，只出现修改配置按钮组
        if (getPortObj.$status) {
          this.editButtonPart = true;
          buttonMenu.style.marginTop = evt.layerY + 'px';
          buttonMenu.style.marginLeft = evt.layerX + 'px';
          this.addButtonPart = false;
          // 点击占用端口连接的设备id
          this.usedEquipmentId = getPortObj.$equipmentId;
        } else {
          // 点击未使用端口，只出现新增类别按钮组
          this.addButtonPart = true;
          buttonMenu.style.marginTop = evt.layerY + 'px';
          buttonMenu.style.marginLeft = evt.layerX + 'px';
          this.editButtonPart = false;
        }
        // 点击端口编号
        this.portNo = getPortObj.$portNo;
      } else {
        // 不是端口位置点击，按钮隐藏
        buttonMenu.style.display = 'none';
      }
    };

  }

  /**
   * 拖拽设备节点获取设备坐标节点事件
   */
  public mouseDragEvent(): void {
    this.graph.enddrag = (evt) => {
      const getEquipmentObj = evt.getData();
      console.log(getEquipmentObj);
    };

  }

  /**
   * 已有设备按钮点击事件
   */
  public existEquipment(): void {
    this.existEquipmentVisible = true;
  }


  /**
   * 新增设备按钮点击事件
   */
  public addEquipment(): void {
    this.xcVisible = true;
  }

  /**
   * 修改当前配置按钮点击事件
   */
  public editConfig(): void {
    this.editXcVisible = true;
  }

  /**
   * 已有设备选中数据
   */
  public equipmentDataChange(event: EquipmentListModel): void {
    if (event) {
      this.hasDeviceData = event;
      const hasDeviceParam = {
        gatewayId: this.gatewayId,
        portNo: this.portNo,
        portPosition: '',
        equipmentId: this.hasDeviceData.equipmentId,
        equipmentType: this.hasDeviceData.equipmentType,
        lineName: '',
        equipmentPosition: '',
        nodeName: '',
      };
      // 已有设备网关配置请求
      this.$equipmentAipService.saveGatewayPortInfo(hasDeviceParam).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          // todo
        } else {
          this.$message.error(result.msg);
        }
      });
    }
  }

  /**
   * 清除当前配置按钮点击事件
   */
  public clearConfig(): void {
    const clearPortParam = {
      gatewayId: this.gatewayId,
      portNo: this.portNo,
      equipmentId: this.usedEquipmentId
    };
    this.$equipmentAipService.deleteGatewayPortInfo(clearPortParam).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 关闭弹框
   */
  public handleCancel(ev: string): void {
    // 关闭新增设备弹框
    if (ev === 'add') {
      this.xcVisible = false;
    } else {
      // 关闭修改当前配置弹框
      this.editXcVisible = false;
    }

  }


  /**
   * 弹框确定
   */
  public handleOk(ev: string): void {
    // 关闭新增设备弹框
    if (ev === 'add') {
      this.isLoading = true;
      const formValue = _.cloneDeep(this.formStatus.group.getRawValue());
      console.log(formValue);
      this.xcVisible = false;
    } else {
      // 关闭修改当前配置弹框
      this.editXcVisible = false;
    }
  }

  /**
   * 获取填写表单数据
   */
  public getFormStatus(ev) {
    this.formStatus = ev;
    this.isValid = this.formStatus.getValid();
  }

  /**
   *  保存页面
   */
  public save(): void {

  }

  /**
   * 返回上个页面
   */
  public goBack(): void {
    window.history.go(-1);
  }

  /**
   * 销毁钩子
   */
  public ngOnDestroy(): void {


  }

  /**
   * 选中新增设备弹框tab切换事件
   */
  public changeTab(type: string): void {
    this.isAddOrConfig = type === 'add';
  }


}
