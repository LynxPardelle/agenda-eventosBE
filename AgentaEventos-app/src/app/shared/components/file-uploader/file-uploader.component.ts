import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Renderer2,
} from '@angular/core';
/* RxJs */
import { Subject } from 'rxjs';
/* Interfaces */
import { IUploadActions, TUploadActions } from '../../interfaces/uploadActions';
/* Services */
import { SharedService } from 'src/app/shared/services/shared.service';
/* Pipes */
import { SizeParserPipe } from '../../pipes/sizeparser.pipe';
/* NGXUploader */
import {
  UploadOutput,
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions,
} from 'ngx-uploader';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
  public sizeParserPipe: SizeParserPipe = new SizeParserPipe();
  public using: 'dragNDrop' | 'selector' | 'none' = 'none';
  public showModal: boolean = false;
  /* Inputs */
  @Input() public uploadInputConfig: UploadInput = {
    type: 'uploadAll',
    url: '/upload',
    method: 'POST',
    data: { foo: 'bar' },
  };
  @Input() public options: UploaderOptions = {
    concurrency: 1,
    maxUploads: 1,
    maxFileSize: 50000000,
  };
  @Input() public uploadSubject: Subject<IUploadActions | TUploadActions> =
    new Subject<IUploadActions | TUploadActions>();
  @Input() public uploaderId: string | undefined;
  @Input() public uploaderBehaviour:
    | 'closeModal&ShowFiles'
    | 'ShowFiles'
    | 'ShowFiles&ShowUploadButton' = 'closeModal&ShowFiles';
  @Input() dragNdropActive: boolean = false;

  /* Button Configs */
  @Input() classButton: string =
    'd-block mx-auto bef-bg-resaltaBG bef-text-mainBG bef-wmn-11rem bef-r-1rem bef-px-1rem mat-elevation-z1';
  @Input() customHtml: string = 'Subir ';
  @Input() disabled: boolean = false;
  @Input() tooltip: string = 'Subir archivos.';
  @Input() tooltipPosition:
    | 'after'
    | 'before'
    | 'above'
    | 'below'
    | 'left'
    | 'right' = 'below';
  @Input() showTooltip: boolean = false;
  @Input() tooltipClass: string = '';
  /* Output */
  @Output() recoverThing = new EventEmitter<any>();
  /* NGXUploader */
  public files: UploadFile[] = []; /* local uploading files array */
  public uploadInput: EventEmitter<UploadInput> =
    new EventEmitter<UploadInput>(); /* input events, we use this to emit data to ngx-uploader */
  public humanizeBytes: Function = humanizeBytes;
  public dragOver: boolean = false;
  public messagesErrorFiles: string[] = [];
  public fileProgress: UploadFile[] = [];
  public doneUploading: boolean = false;
  /* ViewChilds */
  @ViewChild('dragNDropDiv') public dragNDropDiv!: ElementRef;
  @ViewChild('uploadSelector') public uploadSelector!: ElementRef;
  constructor(
    private _sharedService: SharedService,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    this.cssCreate();
    this.uploadSubject.asObservable().subscribe({
      next: (n: IUploadActions | TUploadActions) => {
        const from: string = `From file-uploader ${
          this.uploaderId ? this.uploaderId : ''
        }`;
        if (typeof n === 'string') {
          switch (n) {
            case 'upload':
              if (!this.uploaderId) {
                this._sharedService.consoleLog({
                  action: 'uploading...',
                  from: from,
                });
                this.startUpload();
              }
              break;
            case 'cancelAll':
              this._sharedService.consoleLog({
                action: 'canceling all...',
                from: from,
              });
              this.cancelAllUploads();
              break;
            case 'removeAll':
              this._sharedService.consoleLog({
                action: 'removing all...',
                from: from,
              });
              this.removeAllFiles();
              break;
            default:
              this._sharedService.consoleLog({ action: n, from: from });
              break;
          }
        } else {
          switch (n.actionType) {
            case 'upload':
              if (
                !this.uploaderId ||
                (typeof n.special === 'string' && this.uploaderId === n.special)
              ) {
                this.startUpload();
              }
              break;
            case 'cancel':
              if (typeof n.special === 'string') {
                this.cancelUpload(n.special);
              }
              break;
            case 'remove':
              if (typeof n.special === 'string') {
                this.removeFile(n.special);
              }
              break;
            default:
              this._sharedService.consoleLog({ action: n, from: from });
              break;
          }
        }
      },
      error: (e: any) => {
        this._sharedService.consoleLog(e);
      },
    });
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    if (this.dragNDropDiv && this.dragNDropDiv.nativeElement) {
      this.renderer.listen(this.dragNDropDiv.nativeElement, 'click', () => {});
    }
    if (this.uploadSelector && this.uploadSelector.nativeElement) {
      this.renderer.listen(
        this.uploadSelector.nativeElement,
        'click',
        () => {}
      );
    }
  }
  /* NGX_Bootstrap */
  toggleModal() {
    this.showModal = !this.showModal;
    this.configEventListeners();
    if (this.doneUploading === true) {
      this.changeDoneUploading();
      this.dropMessageErrorFiles();
    }
    this.cssCreate();
  }
  /* NGXUploader */
  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'rejected':
        if (output.file) {
          let messagesErrorFiles: any;
          messagesErrorFiles = [];
          if (output?.file?.nativeFile?.size && output.file.nativeFile.name) {
            messagesErrorFiles.push(
              `Error, el archivo ${
                output.file.nativeFile.name
              } es muy grande, tiene un tamaño de ${this.sizeParserPipe.transform(
                output.file.nativeFile.size
              )} que posiblemente supera los 47.7mb que se pueden subir por archivo, no se acepta el tipo de archivo ${
                output.file.nativeFile.type
              } o sólo se puede subir un archivo a la vez y ya se ha subido uno.`
            );
          } else {
            messagesErrorFiles.push(
              'Error, el archivo es más grande que los 47.7mb que se pueden subir por archivo, no se acepta el tipo de archivo o sólo se puede subir un archivo a la vez y ya se ha subido uno.'
            );
          }
          this.messagesErrorFiles.push(messagesErrorFiles);
          this.uploadSubject.next({
            actionType: 'rejected',
            special: this.messagesErrorFiles,
            uploaderId: this.uploaderId ? this.uploaderId : '',
          });
        }
        break;
      case 'allAddedToQueue':
        /* uncomment this if you want to auto upload files when added
        this.uploadInput.emit(this.uploadInputConfig); */
        this.uploadSubject.next({
          actionType: 'allAddedToQueue',
          uploaderId: this.uploaderId ? this.uploaderId : '',
        });
        if (
          this.uploaderBehaviour === 'closeModal&ShowFiles' &&
          this.messagesErrorFiles.length <= 0
        ) {
          this.toggleModal();
        }
        break;
      case 'addedToQueue':
        if (output.file) {
          this.files.push(output.file);
        }
        this._sharedService.consoleLog('addedToQueue from file uploaded...');
        this._sharedService.consoleLog(output);
        this.uploadSubject.next({
          actionType: 'addedToQueue',
          files: this.files,
          uploaderId: this.uploaderId ? this.uploaderId : '',
        });
        break;
      case 'uploading':
        if (output.file) {
          this.fileProgress = this.files;
          /* update current data in files array for uploading file */
          const index = this.files.findIndex(
            (file: any) => file.id === output.file?.id
          );
          this.files[index] = output.file;
        }
        this.uploadSubject.next({
          actionType: 'uploading',
          files: this.files,
          uploaderId: this.uploaderId ? this.uploaderId : '',
        });
        break;
      case 'removed':
        /* remove file from array when removed */
        this.files = this.files.filter(
          (file: UploadFile) => file !== output.file
        );
        this.uploadSubject.next({
          actionType: 'removed',
          files: this.files,
          uploaderId: this.uploaderId ? this.uploaderId : '',
        });
        this._sharedService.consoleLog(output);
        this._sharedService.consoleLog(this.files);
        break;
      case 'dragOver':
        this.dragOver = true;
        this.uploadSubject.next({
          actionType: 'dragOver',
          uploaderId: this.uploaderId ? this.uploaderId : '',
        });
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        this.uploadSubject.next({
          actionType: 'dragOut',
          uploaderId: this.uploaderId ? this.uploaderId : '',
        });
        break;
      case 'done':
        /* The file is downloaded */
        this.recoverThing.emit(output);
        this.files = [];
        this.doneUploading = true;
        this.uploadSubject.next({
          actionType: 'done',
          special: output,
          uploaderId: this.uploaderId ? this.uploaderId : '',
        });
        break;
      default:
        this._sharedService.consoleLog(output);
        break;
    }
    this._sharedService.consoleLog(output);
  }
  startUpload() {
    this.uploadInput.emit(this.uploadInputConfig);
  }
  cancelAllUploads() {
    this.files.forEach((f) => this.cancelUpload(f.id));
  }
  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }
  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
    // this.toggleModal();
  }
  removeAllFiles(): void {
    this.files.forEach((f) => this.removeFile(f.id));
    // this.uploadInput.emit({ type: 'removeAll' });
  }
  /* Utility */
  changeDoneUploading() {
    this.doneUploading = false;
  }
  dropMessageErrorFiles() {
    this.messagesErrorFiles = [];
  }
  getHtml(): string {
    return `
    <span class="d-flex justify-content-between align-items-center">
      ${this.customHtml}
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13.714" viewBox="0 0 12 13.714">
        <path id="arrow-up-from-bracket-solid" d="M10.286,9.435V11.15a.857.857,0,0,1-.857.857H2.571a.857.857,0,0,1-.857-.857V9.435A.857.857,0,1,0,0,9.435V11.15a2.571,2.571,0,0,0,2.571,2.571H9.429A2.571,2.571,0,0,0,12,11.15V9.435a.857.857,0,1,0-1.714,0ZM5.395.258,1.966,3.686A.857.857,0,1,0,3.178,4.9L5.143,2.934V8.578a.857.857,0,1,0,1.714,0V2.934L8.823,4.9a.857.857,0,1,0,1.212-1.212L6.606.259A.855.855,0,0,0,5.395.258Z" transform="translate(0 -0.007)" fill="#fff"/>
      </svg>
    </span>
    `;
  }
  configEventListeners() {
    if (this.dragNDropDiv && this.dragNDropDiv.nativeElement) {
      this.renderer.listen(
        this.dragNDropDiv.nativeElement,
        'dragover',
        (event) => {
          this.using = 'dragNDrop';
        }
      );
    }
    if (this.uploadSelector && this.uploadSelector.nativeElement) {
      this.renderer.listen(
        this.uploadSelector.nativeElement,
        'click',
        (event) => {
          this.using = 'selector';
        }
      );
    }
  }
  onDragOver(event: any) {
    event.preventDefault();
  }
  onFileChange(event: any) {
    let file: File;
    let files: File[];
    if (!!event.target && !!event.target.files) {
      file = event.target.files[0];
      files = event.target.files;
    } else {
      file = event.dataTransfer.files[0];
      files = event.dataTransfer.files;
    }
    this.uploadSubject.next({
      actionType: 'fileOutsider',
      nativeFile: file,
      uploaderId: this.uploaderId ? this.uploaderId : '',
    });
    this.uploadSubject.next({
      actionType: 'filesOutsiders',
      nativeFiles: files,
      uploaderId: this.uploaderId ? this.uploaderId : '',
    });
  }
  cssCreate(): void {
    this._sharedService.cssCreate();
  }
}
