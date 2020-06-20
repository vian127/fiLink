import {GroupListModel} from '../../../../core-module/model/group-list.model';
import {FacilityListModel} from './facility-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment-list.model';

export class GroupDetailModel {

  /**
   * 分组基本信息
   */
  public groupInfo: GroupListModel = new GroupListModel();

  /**
   * 分组关联设施
   */
  public groupDeviceInfoDtoList: FacilityListModel[] = [];

  /**
   * 分组关联设备
   */
  public groupEquipmentDtoList: EquipmentListModel[] = [];

  /**
   * 设施Id
   */
  public groupDeviceInfoIdList: string[] = [];

  /**
   * 设备id
   */
  public groupEquipmentIdList: string[] = [];

}
