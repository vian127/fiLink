import $ from 'jquery';
import {Injectable} from '@angular/core';
import {FiLinkModalService} from '../service/filink-modal/filink-modal.service';

@Injectable()
export class Download {
  constructor( private $message: FiLinkModalService) {
  }

  /**
   * 通用文件下载
   * param url
   * param fileName
   */
  public downloadFile(url: string, fileName?) {
    const strArr = url.split(/\//g);
    fileName = fileName || strArr[strArr.length - 1];
    // 获取请求路径
    $.ajax({
      url: url,
      type: 'GET',
      xhrFields: {
        responseType: 'blob'
      },
      dataType: 'binary',
      success: (data) => {
        const blob = new Blob([data], {type: 'application/octet-stream'});
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
          const a = document.createElement('a');
          a.download = fileName;
          a.href = URL.createObjectURL(blob);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      },
      error: () => {
        this.$message.error('文件下载失败');
      }
    });
  }

}

