import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/* RxJs */
import { Subject } from 'rxjs';
/* Interfaces */
import { IUploadActions, TUploadActions } from '../../interfaces/uploadActions';
/* Services */
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'special-cell',
  templateUrl: './special-cell.component.html',
  styleUrls: ['./special-cell.component.scss'],
})
export class SpecialCellComponent implements OnInit {
  /* Inputs */
  @Input() type: string = '';
  @Input() config: any;
  @Input() thing: any;
  @Input() public customHtml: (event: any) => string = (event: any) => {
    return '';
  };
  @Input() public uploadSubject: Subject<IUploadActions | TUploadActions> =
    new Subject<IUploadActions | TUploadActions>();
  /* Outputs */
  @Output() clicked = new EventEmitter<any>();
  @Output() changesInput = new EventEmitter<any>();
  @Output() buttonId = new EventEmitter<any>();
  @Output() recoverThing = new EventEmitter<any>();
  constructor(private _sharedService: SharedService) {}
  ngOnInit(): void {}
  cssCreate(): void {
    this._sharedService.cssCreate();
  }
  newUploader() {
    this.config.uploadNew = true;
  }
}
