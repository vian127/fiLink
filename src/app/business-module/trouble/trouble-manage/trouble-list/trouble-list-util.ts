import {CommonUtil} from '../../../../shared-module/util/common-util';
// tslint:disable-next-line:max-line-length
import {getAlarmLevel, getDeviceType, getHandleStatus, getTroubleSource} from '../../../facility/share/const/facility.config';
import {QueryCondition, SortCondition} from '../../../../shared-module/entity/queryCondition';
import {PageBean} from '../../../../shared-module/entity/pageBean';
import {TroubleLevel} from '../../model/const/trouble-level.const';
import {HandelStatusList, TroubleFlow} from '../../model/const/trouble-process.const';
/**
 * 卡片 将请求过来的值 转化后 赋值给卡片
 * type: level告警级别，device设施
 */
export function assignmentCard(that, type: string) {
  if (type === 'level') {
    let sum = 0;
    that.troubleType.forEach(item => {
      sum += item.sum;
    });
    that.troubleType.unshift(
      {
        label: that.language.troubleSum,
        iconClass: 'iconfont fiLink-alarm-all statistics-all-color',
        sum: sum, textClass: 'statistics-all-color'
      },
    );
    that.sliderConfig = that.troubleType.map(item => {
      return {...item, type: 'troubleLevel'};
    });
  } else {
    let sum = 0;
    that.sliderConfig.forEach(item => {
      sum += item.sum;
    });
    that.sliderConfig.unshift({
      label: that.language.troubleSum,
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
        label: that.language.urgentTrouble,
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
        label: that.language.mainTrouble,
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
        label: that.language.secondaryTrouble,
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
        label: that.language.promptTrouble,
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
    case 'multi':
      // 多功能杆
      data = {
        label: that.language.multifunctionalRod,
        sum: sum,
        textClass: CommonUtil.getFacilityTextColor('210'),
        iconClass: CommonUtil.getFacilityIconClassName('210'),
        levelCode: '222'
      };
      break;
  }
  return data;
}
/**
 * 表格配置
 */
export function initTableConfig(that) {
  const typeData = that.troubleTypeList;
  that.tableConfig = {
    outHeight: 108,
    isDraggable: true,
    isLoading: false,
    primaryKey: '02-1',
    showSearchSwitch: true,
    showSizeChanger: true,
    showSearchExport: false,
    searchReturnType: 'array',
    noIndex: false,
    scroll: {x: '1200px', y: '600px'},
    columnConfig: [
      {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
      {
        // 故障编号
        title: that.language.troubleCode, key: 'troubleCode', width: 140, isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {type: 'input'},
        fixedStyle: {fixedLeft: true, style: {left: '124px'}}
      },
      {
        // 处理状态
        title: that.language.handleStatus, key: 'handleStatus', width: 120, isShowSort: true,
        type: 'render',
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: getHandleStatus(that.$nzI18n), label: 'label', value: 'code'
        },
        renderTemplate: that.handleStatusTemp
      },
      {
        // 故障级别
        title: that.language.troubleLevel, key: 'troubleLevel', width: 150, isShowSort: true,
        type: 'render',
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: getAlarmLevel(that.$nzI18n), label: 'label', value: 'code',
        },
        renderTemplate: that.troubleLevelTemp
      },
      {
        // 故障类型
        title: that.language.troubleType, key: 'troubleType', width: 150, isShowSort: true,
        configurable: true,
        searchable: true,
        type: 'render',
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: typeData, label: 'label', value: 'code',
        },
        renderTemplate: that.troubleTypeTemp
      },
      {
        // 故障来源
        title: that.language.troubleSource, key: 'troubleSource', width: 150, isShowSort: true,
        type: 'render',
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: getTroubleSource(that.$nzI18n), label: 'label', value: 'code',
        },
        renderTemplate: that.troubleSourceTemp
      },
      {
        // 故障设施
        title: that.language.troubleFacility, key: 'deviceName', width: 120, isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {
          type: 'render',
          renderTemplate: that.facilityTemp
        }
      },
      {
        // 故障设备
        title: that.language.troubleEquipment, key: 'alarmSourceTypeId', width: 120,
        configurable: true,
        searchable: true,
        isShowSort: true,
        searchConfig: {
          type: 'render',
          renderTemplate: that.equipmentTemp
        }
      },
      {
        // 故障描述
        title: that.language.troubleDescribe, key: 'troubleDescribe', width: 120, isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 填报人
        title: that.language.reportUserName, key: 'reportUserName', width: 125, isShowSort: true,
        configurable: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // 发生时间
        title: that.language.happenTime, key: 'happenTime', width: 180,
        pipe: 'date',
        configurable: true,
        isShowSort: true,
        searchable: true,
        searchKey: 'happenTime',
        searchConfig: {type: 'dateRang'}
      },
      {
        // 责任单位
        title: that.language.deptName, key: 'deptName', width: 180, isShowSort: true,
        configurable: true,
        searchable: true,
        searchKey: 'deptName',
        searchConfig: {type: 'render', renderTemplate: that.UnitNameSearch}
      },
      {
        // 备注
        title: that.language.troubleRemark, key: 'troubleRemark', width: 200, isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: that.language.operate, searchable: true,
        searchConfig: {type: 'operate'},
        key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ],
    showPagination: true,
    bordered: false,
    showSearch: false,
    topButtons: [
      {
        // 新增
        text: '+  ' + that.language.add,
        // permissionCode: '06-2-1-1',
        handle: (currentIndex) => {
          that.navigateToDetail('business/trouble/trouble-list/add',
            {queryParams: {type: 'add'}});
        }
      },
      {
        // 删除
        text: that.commonLanguage.deleteBtn,
        btnType: 'danger',
        canDisabled: true,
        // needConfirm: true,
        // permissionCode: '06-2-1-5',
        className: 'history-process-record-table-top-delete-btn',
        iconClassName: 'fiLink-delete',
        handle: (data) => {
          // that.tableConfig.isLoading = false;
          // const ids = data.filter(item => item.checked).map(item => item.id);
          let flag = true;
          for (let i = 0; i < data.length; i++) {
            if (data[i].handleStatus !== 'uncommit' && data[i].handleStatus !== 'done') {
              flag = false;
              break;
            }
          }
          if (flag) {
            // 组件中的确定取消按钮是反的所以反正用
            that.modalService.confirm({
              nzTitle: that.language.prompt,
              nzContent: that.language.troubleAffirmDelete,
              nzOkText: that.language.cancelText,
              nzCancelText: that.language.okText,
              nzOkType: 'danger',
              nzOnOk: () => {
              },
              nzOnCancel: () => {
                that.tableConfig.isLoading = true;
                const ids = data.filter(item => item.checked).map(item => item.id);
                that.deleteTrouble(ids);
              }
            });
          } else {
            that.$message.error('只能删除未处理和已完成的数据');
          }
        }
      },
    ],
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
          console.log(e);
          that.navigateToDetail('business/index', {queryParams: {id: e.alarmSource}});
        }
      },
      {
        // 详情
        text: that.language.viewDetail,
        permissionCode: '02-1-4',
        className: 'fiLink-view-detail',
        handle: (currentIndex) => {
          that.navigateToDetail('business/trouble/trouble-detail',
            {queryParams: {id: currentIndex.id, alarmCode: currentIndex.alarmCode}});
        }
      },
      {
        // 删除
        text: that.commonLanguage.deleteBtn,
        key: 'isDelete',
        // permissionCode: '06-2-1-5',
        className: 'fiLink-delete red-icon',
        disabledClassName: 'fiLink-delete disabled-red-icon',
        needConfirm: true,
        handle: (currentIndex) => {
          that.tableConfig.isLoading = false;
          that.deleteTrouble([currentIndex.id]);
        }
      },
      {
        // 流程查看
        text: that.language.viewProcess,
        permissionCode: '06-2-1-1',
        className: 'fiLink-trouble-flow',
        key: 'isShowFlow',
        disabledClassName: 'fiLink-trouble-flow disabled-icon',
        handle: (currentIndex) => {
          that.navigateToDetail('business/trouble/trouble-list/flow',
            {queryParams: {instanceId: currentIndex.instanceId}});
        }
      }
    ],
    leftBottomButtons: [
      {
        // 指派
        text: that.language.designate,
        // permissionCode: '02-1-1',
        btnType: 'danger',
        handle: (data) => {
          // 选择一条数据指派根据流程来判断
          if (data && data.length === 1) {
            const paramsObj = {
              // 处理状态
              handleStatus: data[0].handleStatus,
              // 故障ID
              id: data[0].id,
              // 流程实例ID
              instanceId: data[0].instanceId,
              // 流程节点
              flowId: data[0].progessNodeId,
              // 流程节点名称
              handleProgress: data[0].currentHandleProgress,
            };
            if (data[0].handleStatus === HandelStatusList.unCommit) {
              that.navigateToDetail('business/trouble/trouble-list/assign',
                {queryParams: paramsObj});
            } else if (data[0].handleStatus === HandelStatusList.commit && data[0].progessNodeId === TroubleFlow.FIVE) {
              that.navigateToDetail('business/trouble/trouble-list/assign',
                {queryParams: paramsObj});
            } else if (data[0].handleStatus === HandelStatusList.processing && (data[0].progessNodeId === TroubleFlow.SEVEN ||
              data[0].progessNodeId === TroubleFlow.EIGHT || data[0].progessNodeId === TroubleFlow.TEN)) {
              that.navigateToDetail('business/trouble/trouble-list/assign',
                {queryParams: paramsObj});
            } else  {
              that.$message.error(that.language.noAssign);
            }
          } else if (data && data.length > 1) {
            // 选择多条数据指派根据处理状态判断
            const flag = that.isDesignate(data);
            if (flag) {
              const ids = [];
              data.forEach(item => {
                ids.push(item.id);
              });
              that.navigateToDetail('business/trouble/trouble-list/assign',
                {queryParams: {handleStatus: HandelStatusList.unCommit, flowId: '', id: ids.join(',')}});
            } else {
              that.$message.info(that.language.designateMsg);
            }
          } else {
            that.$message.info(that.language.pleaseCheckThe);
          }
        }
      },
      {
        // 勾选备注
        text: that.language.troubleRemark,
        permissionCode: '02-1-4',
        btnType: 'danger',
        handle: (data) => {
          if (data && data.length) {
            that.display.remarkTable = true;
            that.checkRemark = data;
            // that.formStatusRemark.resetControlData('remark', '');
          } else {
            that.$message.info(that.language.pleaseCheckThe);
          }
        }
      }
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
        // clearData(that);
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
      default:
        filterEvent.push(item);
    }
  });
  return filterEvent;
}

