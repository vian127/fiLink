export interface PictureViewInterface {
  /**
   * 图片查看列表查询
   * param body
   */
  imageListByPage(body);

  /**
   * 图片查看 批量删除
   * param body
   */
  deleteImageIsDeletedByIds(body);

  /**
   * 图片批量下载
   * param body
   */
  batchDownLoadImages(body);

  /**
   * 工单图片查看
   * param procId
   * param deviceId
   */
  getPicUrlByAlarmIdAndDeviceId(procId, deviceId);

  /**
   * 告警图片查看
   * param body
   */
  getPicUrlByAlarmId(body);

  /**
   * 判断工单来源
   * param id
   */
  getProcessByProcId(id);

  /**
   * 获取告警来源
   * param id
   */
  queryIsStatus(id);
}
