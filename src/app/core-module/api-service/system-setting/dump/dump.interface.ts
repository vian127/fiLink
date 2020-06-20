import {Observable} from 'rxjs';

export interface DumpInterface {
  /**
   *  查询默认策略
   */
  queryDumpPolicy(params): Observable<Object>;

  /**
   * 更新转储策略
   */
  updateDumpPolicy(body): Observable<Object>;

  /**
   * 手动转储
   */
  handDumpData(type): Observable<Object>;

  /**
   * 查询最新转储信息
   */
  queryNowDumpInfo(type): Observable<Object>;

  /**
   * 查询指定转储信息
   */
  queryDumpInfo(id): Observable<Object>;
}
