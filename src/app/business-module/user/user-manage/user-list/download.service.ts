import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private $httpClient: HttpClient) { }

  /**
   * 下载用户模板service
   */
  downloadTemplate() {
    const downloadUrl = `assets/excel-file/userTemplate.xlsx`;  // 下载路径
    return this.$httpClient.get(downloadUrl, { responseType: 'blob' });
  }

}
