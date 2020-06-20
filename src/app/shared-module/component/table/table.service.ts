/**
 * Created by xiaoconghu on 2018/12/13.
 */
import {Injectable} from '@angular/core';
import {TableConfig} from '../../entity/tableConfig';
import {FilterCondition} from '../../entity/queryCondition';
import {OperatorEnum} from '../../enum/operator.enum';
import {TIME_EXTRA} from '../../const/time-extra';

@Injectable()
export class TableService {
  /**
   * 初始化过滤字段
   * param {TableConfig} tableConfig
   * returns {Map<string, FilterCondition>}
   */
  initFilterParams(tableConfig: TableConfig): Map<string, FilterCondition> {
    const queryTerm = new Map();
    if (tableConfig && tableConfig.columnConfig) {
      tableConfig.columnConfig.forEach(item => {
        if (item.searchable && item.key) {
          const filterCondition = new FilterCondition(item.searchKey || item.key);
          filterCondition.filterType = item.searchConfig.type;
          if (item.searchConfig.initialValue) {
            filterCondition.filterValue = item.searchConfig.initialValue;
            filterCondition.initialValue = item.searchConfig.initialValue;
          }
          if (item.searchConfig.type === 'input') {
            filterCondition.operator = OperatorEnum.like;
          } else if (item.searchConfig.selectType === 'multiple') {
            filterCondition.operator = OperatorEnum.in;
          } else {
            filterCondition.operator = OperatorEnum.eq;
          }
          queryTerm.set(item.key, filterCondition);
        }
      });
    }
    return queryTerm;
  }

  /**
   * 创建数组过滤条件
   * param {Map<string, FilterCondition>} queryTerm
   * returns {FilterCondition[]}
   */
  createFilterConditions(queryTerm: Map<string, FilterCondition>): FilterCondition[] {
    const filterConditions = [];
    queryTerm.forEach(value => {
      // 当filterType时间段的并且返回值存在
      if (value.filterType === 'dateRang' && value.filterValue instanceof Array && value.filterValue.length > 0) {
        const temp = value.filterValue;
        const {filterField, operator} = value;
        const start = {filterValue: 0, filterField, operator}, end = {filterValue: 0, filterField, operator};
        // 去除随机的毫秒值补000
        start.filterValue = Math.floor(temp[0] / 1000) * 1000;
        start.operator = OperatorEnum.gte;
        start['extra'] = TIME_EXTRA;
        start.filterField = filterField;
        // 去除随机的毫秒值补999
        end.filterValue = Math.floor(temp[1] / 1000) * 1000 + 999;
        end.operator = OperatorEnum.lte;
        end['extra'] = TIME_EXTRA;
        end.filterField = filterField;
        // 当两个值都有的情况下加入到查询条件里面
        if (start.filterValue && end.filterValue) {
          filterConditions.push(start, end);
        }
      } else {
        const {filterValue, filterField, operator} = value;
        // 当操作符为‘in’并且有值的情况
        if (operator === OperatorEnum.in) {
          if (filterValue && filterValue.length > 0) {
            filterConditions.push({filterValue, filterField, operator});
          }
        } else {
          if (filterValue) {
            // 如果是operator为like出去首尾空格
            if (operator === OperatorEnum.like) {
              const __filterValue = filterValue.trim();
              filterConditions.push({filterValue: __filterValue, filterField, operator});
            } else {
              filterConditions.push({filterValue, filterField, operator});
            }
          }
        }
      }
    });
    return filterConditions;
  }

  /**
   * 清空所有条件
   * param {Map<string, FilterCondition>} queryTerm
   */
  resetFilterConditions(queryTerm: Map<string, FilterCondition>) {
    queryTerm.forEach((value, key) => {
      if (value.initialValue && value.initialValue !== 0) {
        value.filterValue = value.initialValue;
      } else {
        value.filterValue = null;
      }
    });
  }

  /**
   * 创建一个map对象过滤条件
   * param {Map<string, FilterCondition>} queryTerm
   * returns {Map<string, any>}
   */
  createFilterConditionMap(queryTerm: Map<string, FilterCondition>): Object {
    const query = Object.create(null);
    queryTerm.forEach((value, key) => {
      // 如果是operator为like出去首尾空格
      if (value.operator === OperatorEnum.like && value.filterValue) {
        query[value.filterField] = value.filterValue.trim();
      } else {
        query[value.filterField] = value.filterValue;
      }
    });
    return query;
  }

  /**
   * 判断所有子元素是否都没有选中
   * param data
   * param expendDataKey 子元素数组名字 string
   */
  checkStatus(data, expendDataKey) {
    // 全不选
    let allUnChecked = true;
    (function checkAllData(_data) {
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].checked) {
          allUnChecked = false;
          break;
        }
        if (_data[i][expendDataKey] && _data[i][expendDataKey].length > 0) {
          checkAllData(_data[i][expendDataKey]);
        }
      }
    })(data);
    return allUnChecked;
  }
}
