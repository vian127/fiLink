import {CommonUtil} from '../../../../shared-module/util/common-util';
import {getAlarmLevel, getDeviceType} from '../../../facility/share/const/facility.config';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {AlarmLevel} from './const/alarm-level.const';

/**
 * 卡片 将请求过来的值 转化后 赋值给卡片
 * type: level告警级别，device设施
 */
export function assignmentCard(that, type: string) {
  if (type === 'level') {
    let sum = 0;
    that.alarmType.forEach(item => {
      sum += item.sum;
    });
    that.alarmType.unshift(
      {
        label: that.language.alarmSum,
        iconClass: 'iconfont fiLink-alarm-all statistics-all-color',
        sum: sum, textClass: 'statistics-all-color'
      },
    );
    that.sliderConfig = that.alarmType.map(item => {
      return {...item, type: 'alarmLevel'};
    });
  } else {
    let sum = 0;
    that.sliderConfig.forEach(item => {
      sum += item.sum;
    });
    that.sliderConfig.unshift({
      label: that.language.alarmSum,
      iconClass: CommonUtil.getFacilityIconClassName(null),
      textClass: CommonUtil.getFacilityTextColor(null),
      code: null, sum: sum
    });
    that.sliderConfig = that.sliderConfig.map(item => {
      return {...item, type: 'deviceType'};
    });
  }
}


/**
 * 传入 类型 如 urgentAlarmCount
 */
export function cardDataAnalysis(that, type: string, sum) {
  let data;
  switch (type) {
    case 'urgentAlarmCount':
      // 紧急
      data = {
        label: that.language.urgentAlarm,
        iconClass: 'iconfont fiLink-alarm-urgency',
        sum: sum,
        textClass: '',
        levelCode: '1',
        color: ''
      };
      break;
    case 'mainAlarmCount':
      // 主要
      data = {
        label: that.language.mainAlarm,
        iconClass: 'iconfont fiLink-alarm-serious',
        sum: sum,
        textClass: '',
        levelCode: '2',
        color: ''
      };
      break;
    case 'minorAlarmCount':
      // 次要
      data = {
        label: that.language.secondaryAlarm,
        iconClass: 'iconfont fiLink-alarm-secondary',
        sum: sum,
        textClass: '',
        levelCode: '3',
        color: ''
      };
      break;
    case 'hintAlarmCount':
      // 提示
      data = {
        label: that.language.promptAlarm,
        iconClass: 'iconfont fiLink-alarm-prompt',
        sum: sum,
        textClass: '',
        levelCode: '4',
        color: ''
      };
      break;
    case 'opticalBok':
      // 光交箱
      data = {
        label: that.language.opticalBox,
        sum: sum,
        textClass: CommonUtil.getFacilityTextColor('001'),
        iconClass: CommonUtil.getFacilityIconClassName('001'),
        levelCode: '001'
      };
      break;
    case 'well':
      // 人井
      data = {
        label: that.language.well,
        sum: sum,
        textClass: CommonUtil.getFacilityTextColor('030'),
        iconClass: CommonUtil.getFacilityIconClassName('030'),
        levelCode: '030'
      };
      break;
    case 'distributionFrame':
      // 配线架
      data = {
        label: that.language.distributionFrame,
        sum: sum,
        textClass: CommonUtil.getFacilityTextColor('060'),
        iconClass: CommonUtil.getFacilityIconClassName('060'),
        levelCode: '060'
      };
      break;
    case 'junctionBox':
      // 接头盒
      data = {
        label: that.language.junctionBox,
        sum: sum,
        textClass: CommonUtil.getFacilityTextColor('090'),
        iconClass: CommonUtil.getFacilityIconClassName('090'),
        levelCode: '090'
      };
      break;
    case 'splittingBox':
      // 室外柜
      data = {
        label: that.language.outdoorCabinet,
        sum: sum,
        textClass: CommonUtil.getFacilityTextColor('210'),
        iconClass: CommonUtil.getFacilityIconClassName('210'),
        levelCode: '210'
      };
      break;
  }
  return data;
}


/**
 * 将转化的值 按照顺序赋给卡片
 *  type: level告警级别， device设施
 */
export function lineUpGive(that, type: string, data) {
  if (type === 'level') {
    let urgentAlarm;
    let mainAlarm;
    let secondaryAlarm;
    let promptAlarm;
    urgentAlarm = cardDataAnalysis(that, 'urgentAlarmCount', data.urgentAlarmCount);
    mainAlarm = cardDataAnalysis(that, 'mainAlarmCount', data.mainAlarmCount);
    secondaryAlarm = cardDataAnalysis(that, 'minorAlarmCount', data.minorAlarmCount);
    promptAlarm = cardDataAnalysis(that, 'hintAlarmCount', data.hintAlarmCount);
    that.alarmType.push(urgentAlarm);
    that.alarmType.push(mainAlarm);
    that.alarmType.push(secondaryAlarm);
    that.alarmType.push(promptAlarm);
    assignmentCard(that, 'level');
    that.sliderConfig[1]['color'] = that.$alarmStoreService.getAlarmColorByLevel(AlarmLevel.urgentAlarmCode).backgroundColor;
    that.sliderConfig[2]['color'] = that.$alarmStoreService.getAlarmColorByLevel(AlarmLevel.mainAlarmCode).backgroundColor;
    that.sliderConfig[3]['color'] = that.$alarmStoreService.getAlarmColorByLevel(AlarmLevel.minorAlarmCode).backgroundColor;
    that.sliderConfig[4]['color'] = that.$alarmStoreService.getAlarmColorByLevel(AlarmLevel.hintAlarmCode).backgroundColor;
  } else {
    let Optical_Box;
    let Well;
    let Distribution_Frame;
    let Junction_Box;
    let OUTDOOR_CABINET;
    Optical_Box = cardDataAnalysis(that, 'opticalBok', data.opticalBok);
    Well = cardDataAnalysis(that, 'well', data.well);
    Distribution_Frame = cardDataAnalysis(that, 'distributionFrame', data.distributionFrame);
    Junction_Box = cardDataAnalysis(that, 'junctionBox', data.junctionBox);
    OUTDOOR_CABINET = cardDataAnalysis(that, 'splittingBox', data.splittingBox);
    that.sliderConfig.push(Optical_Box);
    that.sliderConfig.push(Well);
    that.sliderConfig.push(Distribution_Frame);
    that.sliderConfig.push(Junction_Box);
    that.sliderConfig.push(OUTDOOR_CABINET);
    assignmentCard(that, 'device');
  }
}

/**
 * 表格配置
 */
export function initTableConfig(that) {
  const typeData = that.alarmTypeList;
  that.tableConfig = {
    outHeight: 108,
    isDraggable: true,
    isLoading: false,
    primaryKey: '02-1',
    showSearchSwitch: true,
    showSizeChanger: true,
    showSearchExport: true,
    searchReturnType: 'array',
    scroll: {x: '1200px', y: '600px'},
    columnConfig: [
      {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
      {
        title: that.language.alarmName, key: 'alarmName', width: 140, isShowSort: true,
        searchable: true, searchKey: 'alarmNameId',
        searchConfig: {
          type: 'render',
          renderTemplate: that.alarmName
        },
        fixedStyle: {fixedLeft: true, style: {left: '124px'}}
      },
      {
        // 告警级别
        title: that.language.alarmFixedLevel, key: 'alarmFixedLevel', width: 100, isShowSort: true,
        type: 'render',
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: getAlarmLevel(that.$nzI18n), label: 'label', value: 'code'
        },
        renderTemplate: that.alarmFixedLevelTemp
      },
      {
        // 告警对象
        title: that.language.alarmobject, key: 'alarmObject', width: 150, isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {
          type: 'render',
          renderTemplate: that.departmentTemp
        },
      },
      {
        // 区域
        title: that.language.area, key: 'areaName', width: 120, isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'render',
          renderTemplate: that.areaSelectorTemp
        },
      },
      {
        title: that.language.address, key: 'address', width: 150, isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 告警类别
        title: that.language.AlarmType, key: 'alarmType', width: 150, isShowSort: true,
        configurable: true,
        searchable: true,
        type: 'render',
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: typeData, label: 'label', value: 'code',
        },
        renderTemplate: that.alarmTypeTemp
      },
      {
        title: that.language.responsibleDepartment, key: 'responsibleDepartment', width: 120, isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 设施类型
        title: that.language.alarmSourceType, key: 'alarmSourceTypeId', width: 120,
        configurable: true,
        searchable: true,
        isShowSort: true,
        type: 'render',
        renderTemplate: that.alarmSourceTypeTemp,
        searchConfig: {
          type: 'select', selectType: 'multiple', selectInfo: getDeviceType(that.$nzI18n), label: 'label', value: 'code'
        }
      },
      {
        // 频次
        title: that.language.alarmHappenCount, key: 'alarmHappenCount', width: 80, isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 清除状态
        title: that.language.alarmCleanStatus, key: 'alarmCleanStatus', width: 125, isShowSort: true,
        type: 'render',
        configurable: true,
        searchable: true,
        renderTemplate: that.isCleanTemp,
        searchConfig: {
          type: 'select', selectType: 'multiple', selectInfo: [
            {label: that.language.noClean, value: 3},
            {label: that.language.isClean, value: 1},
            {label: that.language.deviceClean, value: 2}
          ]
        }
      },
      {
        // 确认状态
        title: that.language.alarmConfirmStatus, key: 'alarmConfirmStatus', width: 120, isShowSort: true,
        type: 'render',
        configurable: true,
        searchable: true,
        renderTemplate: that.isConfirmTemp,
        searchConfig: {
          type: 'select', selectType: 'multiple', selectInfo: [
            {label: that.language.isConfirm, value: 1},
            {label: that.language.noConfirm, value: 2}
          ]
        }
      },
      {
        // 首次发生时间
        title: that.language.alarmBeginTime, key: 'alarmBeginTime', width: 180, isShowSort: true,
        searchable: true,
        configurable: true,
        pipe: 'date',
        searchConfig: {type: 'dateRang'}
      },
      {
        // 最近发生时间
        title: that.language.alarmNearTime, key: 'alarmNearTime', width: 180, isShowSort: true,
        searchable: true,
        configurable: true,
        pipe: 'date',
        searchConfig: {type: 'dateRang'}
      },
      {
        // 告警持续时间
        title: that.language.alarmContinousTime,
        key: 'alarmContinousTime', width: 110,
        configurable: true,
      },
      {
        // 确认时间
        title: that.language.alarmConfirmTime, key: 'alarmConfirmTime', width: 180, isShowSort: true,
        searchable: true,
        configurable: true,
        pipe: 'date',
        searchConfig: {type: 'dateRang'}
      },
      {
        // 清除时间
        title: that.language.alarmCleanTime, key: 'alarmCleanTime', width: 180, isShowSort: true,
        searchable: true,
        configurable: true,
        pipe: 'date',
        searchConfig: {type: 'dateRang'}
      },
      {
        // 清除用户
        title: that.language.alarmCleanPeopleNickname, key: 'alarmCleanPeopleNickname', width: 120, isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 确认用户
        title: that.language.alarmConfirmPeopleNickname,
        key: 'alarmConfirmPeopleNickname',
        width: 120,
        isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 告警详情
        title: that.language.alarmDetails, key: 'alarmType', width: 200, isShowSort: true,
        searchable: true,
        configurable: true,
        type: 'render',
        searchConfig: {type: 'input'},
        renderTemplate: that.alarmDetailsTemp
      },
      // {
      //   // 告警附加信息
      //   title: that.language.alarmAdditionalInformation, key: 'extraMsg', width: 200, isShowSort: true,
      //   searchable: true,
      //   configurable: true,
      //   searchConfig: {type: 'input'},
      // },
      // {
      //   // 告警处理建议
      //   title: that.language.alarmProcessing, key: 'alarmProcessing', width: 200, isShowSort: true,
      //   searchable: true,
      //   configurable: true,
      //   searchConfig: {type: 'input'}
      // },
      {
        title: that.language.remark, key: 'remark', width: 200, isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: that.language.operate, searchable: true,
        searchConfig: {
          type: 'operate', customSearchHandle: () => {
            that.display.templateTable = true;
          }
        }, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ],
    showPagination: true,
    bordered: false,
    showSearch: false,
    topButtons: [],
    operation: [
      // build2功能
      {
        // 定位
        text: that.language.location,
        key: 'isShowBuildOrder',
        permissionCode: '02-1-3',
        className: 'fiLink-location',
        disabledClassName: 'fiLink-location disabled-icon',
        handle: (e) => {
          that.navigateToDetail('business/index', {queryParams: {id: e.alarmSource}});
        }
      },
      {
        // 修改备注
        text: that.language.updateRemark,
        permissionCode: '02-1-4',
        className: 'fiLink-edit',
        handle: (currentIndex) => {
          // that.remarkValue = currentIndex.remark;
          that.formStatusRemark.resetControlData('remark', currentIndex.remark);
          that.display.remarkTable = true;
          that.checkRemark = [currentIndex];
        }
      },
      {
        // 查看图片
        text: that.language.viewPicture,
        className: 'fiLink-view-photo',
        permissionCode: '02-1-5',
        // key: 'isShowViewIcon',
        handle: (e) => {
          // 查看图片
          that.examinePicture(e);
        }
      },
      {
        // 创建工单
        text: that.language.buildOrder,
        permissionCode: '06-2-1-1',
        className: 'fiLink-create',
        // key: 'isShowBuildOrder',
        disabledClassName: 'fiLink-create disabled-icon',
        handle: (e) => {
          that.areaId = e.areaId;
          that.display.creationWorkOrder = true;
          that.creationWorkOrderData = e;
        }
      }, {
        // 诊断详情
        text: that.language.alarmDiagnose,
        // key: 'isShowBuildOrder',
        permissionCode: '02-1-3',
        className: 'fiLink-diagnose-details',
        disabledClassName: 'fiLink-diagnose-details disabled-icon',
        handle: (e) => {
          that.navigateToDetail('/business/alarm/diagnose-details',
            {queryParams: {id: e.alarmSource, type: that.pageType, areaId: e.areaId, alarmId: e.id, alarmCode: e.alarmCode}});
        }
      }
    ],
    leftBottomButtons: [
      {
        // 告警确认
        text: that.language.alarmConfirm,
        permissionCode: '02-1-1',
        handle: (data) => {
          that.alarmComfirm(data);
        }
      },
      {
        // 告警清除
        text: that.language.alarmClean,
        permissionCode: '02-1-2',
        handle: (data) => {
          that.alarmClean(data);
        }
      },
      // build2功能
      {
        // 勾选备注
        text: that.language.updateRemark,
        permissionCode: '02-1-4',
        handle: (data) => {
          if (data && data.length) {
            that.display.remarkTable = true;
            that.checkRemark = data;
            that.formStatusRemark.resetControlData('remark', '');
          } else {
            that.$message.info(that.language.pleaseCheckThe);
          }
        }
      },
      {
        // 诊断设置
        text: that.language.diagnosticSet,
        // permissionCode: '02-1-2',
        handle: (data) => {
            that.display.diagnoseSet = true;
            that.getDiagnosticData();
        }
      },
    ],
    sort: (event: SortCondition) => {
      if (event.sortField === 'alarmContinousTimeName') {
        // 当进行告警持续时间排序时 传给后台的是 alarmContinousTime 这个参数
        that.queryCondition.sortCondition.sortField = 'alarmContinousTime';
      } else {
        that.queryCondition.sortCondition.sortField = event.sortField;
      }
      that.queryCondition.sortCondition.sortRule = event.sortRule;
      if (that.templateId) {
        const data = {
          queryCondition: {},
          pageCondition: {
            'pageNum': that.pageBean.pageIndex,
            'pageSize': that.pageBean.pageSize
          },
          sortCondition: that.queryCondition.sortCondition
        };
        that.templateList(data);
      } else {
        that.refreshData();
      }
    },
    handleSearch: (event) => {
      that.queryCondition.filterConditions = [];
      that.templateId = null;
      if (!event.length) {
        clearData(that);
        that.isClickSlider = false;
        that.queryCondition.pageCondition = {pageSize: that.pageBean.pageSize, pageNum: 1};
        that.refreshData();
      } else {
        const filterEvent = handleFilter(event, that);
        that.pageBean = new PageBean(that.queryCondition.pageCondition.pageSize, 1, 1);
        that.queryCondition.filterConditions = filterEvent;
        that.queryCondition.pageCondition = {pageSize: that.pageBean.pageSize, pageNum: that.pageBean.pageIndex};
        that.refreshData();
      }
    },
    handleExport: (event) => {
      const propertyName = ['alarmFixedLevel', 'alarmSourceTypeId', 'alarmCleanStatus',
        'alarmConfirmStatus', 'alarmBeginTime', 'alarmNearTime', 'alarmConfirmTime', 'alarmCleanTime',
        'alarmContinousTime'];
      for (let i = 0; i < event.columnInfoList.length; i++) {
        if (propertyName.indexOf(event.columnInfoList[i].propertyName) !== -1) {
          event.columnInfoList[i].isTranslation = 1;
        }
      }
      // 处理参数
      const body = {
        queryCondition: new QueryCondition(),
        columnInfoList: event.columnInfoList,
        excelType: event.excelType,
      };
      // 处理选择的项目
      if (event.selectItem.length > 0) {
        event.queryTerm['alarmIds'] = event.selectItem.map(item => item.id);
        body.queryCondition.filterConditions = [];
        body.queryCondition.filterConditions.push({
          filterField: 'id',
          operator: 'in',
          filterValue: event.queryTerm['alarmIds']
        });
      } else {
        if (that.templateId) {
          // 按照模板查询
          body.queryCondition.filterConditions.push({
            filterField: 'templateId',
            filterValue: that.templateId,
            operator: 'in'
          });
        } else {
          body.queryCondition.filterConditions = handleFilter(event.queryTerm, that);
        }
      }
      that.exportAlarm(body);
    }
  };
}

/**
 * 过滤条件处理
 */
function handleFilter(filters, that) {
  const filterEvent = [];
  filters.forEach(item => {
    switch (item.filterField) {
      case 'alarmHappenCount':
        // 频次
        filterEvent.push({
          'filterField': 'alarmHappenCount',
          'filterValue': Number(item.filterValue) ? Number(item.filterValue) : 0,
          'operator': 'eq',
        });
        break;
      case 'alarmName':
        // 告警名称
        if (that._checkAlarmName.name) {
          filterEvent.push({
            'filterField': 'alarmName',
            'filterValue': that._checkAlarmName.name.split(','),
            'operator': 'in',
          });
        }
        break;
      case 'alarmNameId':
        // 告警名称
        if (that._checkAlarmName.name) {
          filterEvent.push({
            'filterField': 'alarmNameId',
            'filterValue': that._checkAlarmName.ids,
            'operator': 'in',
          });
        }
        break;
      case 'alarmObject':
        // 告警对象
        if (that.checkAlarmObject.name) {
          filterEvent.push({
            'filterField': 'alarmSource',
            'filterValue': that.checkAlarmObject.ids,
            'operator': 'in',
          });
        }
        break;
      case 'areaName':
        // 区域
        if (that.areaList.name) {
          filterEvent.push({
            'filterField': 'areaId',
            'filterValue': that.areaList.ids,
            'operator': 'in',
          });
        }
        break;
      default:
        filterEvent.push(item);
    }
  });
  return filterEvent;
}

/**
 * 区域告警等模板数据清除
 */
export function clearData(that) {
  that.templateId = null;
  //  告警名称 区域  告警对象 清空
  that.areaList = {
    ids: [],
    name: ''
  };
  that._checkAlarmName = {
    name: '',
    ids: []
  };
  that.checkAlarmObject = {
    ids: [],
    name: ''
  };
  // 区域
  that.initAreaConfig();
  // 告警名称
  that.initAlarmName();
  // 告警对象
  that.initAlarmObjectConfig();
}
