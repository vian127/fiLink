import {ColumnConfig} from './tableConfig';

/**
 * Created by wh1709040 on 2018/12/26.
 * table选择器配置
 */
export class TableSelectorConfig {
  title: string; // 选择器标题
  sourceColumn: ColumnConfig[]; // 选择器源配置
  selectedColumn: ColumnConfig[]; // 选择器选择结果配置
}
