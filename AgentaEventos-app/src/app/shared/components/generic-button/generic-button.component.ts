import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
/* Services */
import { SharedService } from '../../services/shared.service';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
/* Pipes */
import { HarshifyPipe } from '../../pipes/harshify.pipe';
@Component({
  selector: 'generic-button',
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss'],
  providers: [HarshifyPipe],
})
export class GenericButtonComponent implements OnInit {
  public randomId: string = '';
  @Input() type: string = 'customHTML';
  @Input() classButton: string = '';
  @Input() customHtml: string = 'button';
  @Input() disabled: boolean = false;
  @Input() disabledClassButton: string = '';
  @Input() tooltip: string = '';
  @Input() tooltipPosition:
    | 'after'
    | 'before'
    | 'above'
    | 'below'
    | 'left'
    | 'right' = 'below';
  @Input() showTooltip: boolean = false;
  @Input() tooltipClass: string = '';
  @Input() matButtonType:
    | 'none'
    | 'basic'
    | 'raised'
    | 'stroked'
    | 'flat'
    | 'icon'
    | 'fab'
    | 'mini-fab' = 'none';

  /* Output */
  @Output() clicked = new EventEmitter<any>();
  @Output() buttonId = new EventEmitter<string>();
  constructor(
    private _harshifyPipe: HarshifyPipe,
    private _befService: BefService,
    private _sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.randomId = this._harshifyPipe.transform(9, 'letters');
    this.buttonId.emit(this.randomId);
    if (this.classButton !== '' && this.classButton.includes(' ')) {
      let classButton = this.classButton
        .split(' ')
        .filter((cB) => cB.includes('bef-'))
        .join(' ');
      if (classButton !== '' && classButton.includes(' ')) {
        this._befService.updateClasses(this.classButton.split(' '));
      }
    }
    this.cssCreate();
  }

  cssCreate(): void {
    this._sharedService.cssCreate();
  }
}
