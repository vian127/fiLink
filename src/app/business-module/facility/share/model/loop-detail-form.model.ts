/**
 * 回路新增、编辑表单模型
 */

export class LoopDetailFormModel {
  /**
   * 回路id 编辑有
   */
  public loopId?: string;
  /**
   * 回路名称
   */
  public loopName: string;
  /**
   * 回路类型
   */
  public loopType: string;
  /**
   * 所属配电箱
   */
  public distributionBoxId: any;
  /**
   * 关联设施
   */
  public deviceInfo: any;
  /**
   * 控制对象
   */
  public controlObject: any;
  /**
   * 备注
   */
  public remark: string;
}
