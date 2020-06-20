import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {Result} from '../../../../shared-module/entity/result';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {DeviceDetailCode} from '../../share/const/facility.config';

/**
 * 设施详情组件
 */
@Component({
    selector: 'app-facility-view-detail',
    templateUrl: './facility-view-detail.component.html',
    styleUrls: ['./facility-view-detail.component.scss']
})
export class FacilityViewDetailComponent implements OnInit {
    // 设施id
    public deviceId: string;
    // 序列号
    public serialNum: string;
    // 设施详情code
    public detailCode: any = [];
    // 设施类型
    public deviceType: string;
    // 设施名称
    public deviceName: string;
    // 位置
    public positionBase: string;
    // 设施语音包
    public language: FacilityLanguageInterface;
    // 设施详情版块显示隐藏（一期）
    public detailCodeShow: any = {
        // 基础信息
        infrastructureDetails: false,
        // 是否有锁
        hasGuard: false,
        // 基本操作
        basicOperation: false,
        // 智能标签
        intelligentLabelDetail: false,
        // 设施告警
        facilityAlarm: false,
        // 设施工单
        facilityWorkOrder: false,
        // 设施日志
        facilityViewDetailLog: false,
        // 设施图标
        facilityImgView: false,
        // 是否有主控
        hasControl: false,
    };

    // 设施详情版块显示隐藏(二期)
    public detailIsShow: any = {
        // 基础信息
        infrastructureDetails: false,
        // 基本操作
        basicOperation: false,
        // 挂载设备详情概览列表
        mountEquipment: false,
        // 设施告警
        facilityAlarm: false,
        // 设施工单
        facilityWorkOrder: false,
        // 设施日志
        facilityViewDetailLog: false,
        // 设施图标
        facilityImgView: false,
    };


    constructor(private $active: ActivatedRoute,
                private $i18n: NzI18nService,
                private $facilityService: FacilityService) {
    }

    ngOnInit() {
        this.language = this.$i18n.getLocaleData('facility');
        this.$active.queryParams.subscribe(params => {
            this.deviceId = params.id;
            this.deviceType = params.deviceType;
            this.serialNum = params.serialNum;
            this.deviceName = params.deviceName;
            this.positionBase = params.positionBase;
            if (['001', '030', '060', '090', '210'].includes(this.deviceType)) {
                // 获取 详情页面模块id(一期)
                this.$facilityService.getDetailCode({deviceId: this.deviceId, deviceType: this.deviceType})
                    .subscribe((result: Result) => {
                        const data = result.data || [];
                        this.detailCode = data.map(item => item.id);
                        this.convertCodeToShow(this.detailCode);
                    });
            } else {
                // 二期 设施详情界面模块前端根据类型展示
                this.detailIsShow = {
                    // 基础信息
                    infrastructureDetails: true,
                    // 基本操作
                    basicOperation: true,
                    // 挂载设备详情概览列表
                    mountEquipment: true,
                    // 设施告警
                    facilityAlarm: true,
                    // 设施工单
                    facilityWorkOrder: true,
                    // 设施日志
                    facilityViewDetailLog: true,
                    // 设施图标
                    facilityImgView: true,
                };
            }

        });
    }

    /**
     * 转换code码 为显示隐藏
     * param {string[]} code
     */
    convertCodeToShow(code: string[]) {
        this.detailCodeShow = {
            infrastructureDetails: code.includes(DeviceDetailCode.infrastructureDetails),
            hasControl: code.includes(DeviceDetailCode.intelligentEntranceGuard),
            hasGuard: code.includes(DeviceDetailCode.intelligentEntranceGuard) || code.includes(DeviceDetailCode.passiveLock),
            basicOperation: code.includes(DeviceDetailCode.basicOperation),
            intelligentLabelDetail: code.includes(DeviceDetailCode.intelligentLabelDetail) &&
                code.includes(DeviceDetailCode.intelligentLabelSetting),
            facilityAlarm: code.includes(DeviceDetailCode.facilityAlarm),
            facilityWorkOrder: code.includes(DeviceDetailCode.facilityWorkOrder),
            facilityViewDetailLog: true,
            facilityImgView: code.includes(DeviceDetailCode.facilityImgView)
        };
    }

}
