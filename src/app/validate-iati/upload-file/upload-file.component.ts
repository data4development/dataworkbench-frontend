import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { FileUploadService } from './../shared/file-upload.service';
import { LogService } from './../../core/logging/log.service';
import { MessagesService } from './../shared/messages.service';
import { Message } from '../shared/message';
import { MessageType } from '../shared/message-type.enum';
import { Mode } from '../validate-iati';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit, OnDestroy {
  @Output() setActiveMode = new EventEmitter<Mode>();
  @Output() clear = new EventEmitter<void>();

  @Input() mode: Mode;

  selectedFiles: File[] = [];
  workspaceId = '';
  fileUploaded = false;
  uploading = false;
  fetchUrl = '';
  uploadId = '';
  message: Message;
  messages: Message[] = [];
  messagesSub: Subscription;

  constructor(
    private readonly http: HttpClient,
    private readonly logger: LogService,
    private readonly router: Router,
    private readonly fileUploadService: FileUploadService,
    public readonly messageService: MessagesService
  ) { }

  ngOnInit() {
    this.messagesSub = this.messageService.messages
      .subscribe(
        (messages: Message[]) => {
          console.log('messages: ', messages);
          this.messages = messages;
          this.message = messages[messages.length - 1];
        }
      );
  }

  onFileChanged(event) {
    this.uploading = false;
    this.setActiveMode.emit(Mode.local);
    this.selectedFiles = event.target.files;
  }

  onFetch() {
    const blob = null;
    const request = new XMLHttpRequest();
    request.open('GET', this.fetchUrl);
    request.responseType = 'blob';
    request.onload = function () {
      const reader = new FileReader();
      reader.readAsDataURL(request.response);
      reader.onload = function (e) {
        console.log('DataURL:', e.target);
      };
    };
    request.send();
  }

  UploadFile() {
    if (this.selectedFiles.length) {
      this.uploading = true;
      this.fileUploadService.uploadFiles(this.selectedFiles).subscribe(
        msg => {
          this.uploading = false;
          if (msg.type === MessageType.done) {
            this.fileUploaded = true;
            this.uploadId = msg.uploadId;
          }
        },
        error => {
          this.logger.debug('Error message component: ', error);
          this.uploading = false;
        }
      );
    }
  }

  ValidateFile() {
    this.router.navigate(['validate', this.uploadId]);
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }


  clearFiles() {
    this.clear.emit();
    this.selectedFiles = [];
  }
}
