import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UploadFile} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {FileUploadComponentModel} from '../../entity/file-upload-component.model';

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload-component.component.html',
  styleUrls: ['./upload-component.component.scss']
})
export class UploadComponentComponent implements OnInit {
  @Input() uploadBtnDisabled: boolean = false;
  @Input() fileList: UploadFile[] = [];
  @Input() fileInfo = new FileUploadComponentModel();
  @Output() uploadChange = new EventEmitter<UploadFile[]>();
  @Output() removeFileChange = new EventEmitter<UploadFile>();

  constructor(private $message: FiLinkModalService) {
  }

  ngOnInit() {
  }

  beforeUpload = (file: UploadFile): boolean => {
    if (this.fileList.length < this.fileInfo.fileLimitCount) {
      if (this.fileInfo.fileType.length && !this.fileInfo.fileType.includes(file.type)) {
        this.$message.error(this.fileInfo.fileErrorMsg);
      } else {
        this.fileList = this.fileList.concat(file);
        this.uploadChange.emit(this.fileList);
      }
    } else {
      this.$message.error(`最多只能上传${this.fileInfo.fileLimitCount}个文件`);
    }
    return false;
  }

  removeUpload = (file: UploadFile): boolean => {
    this.removeFileChange.emit(file);
    return true;
  }

}
