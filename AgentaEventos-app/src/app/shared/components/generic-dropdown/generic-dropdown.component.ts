import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
/* Interfaces */
import { IOptionDropdown } from '../../interfaces/optionDropdown';
/* Services */
import { SharedService } from '../../services/shared.service';
/* Pipes */
import { HarshifyPipe } from '../../pipes/harshify.pipe';
@Component({
  selector: 'generic-dropdown',
  templateUrl: './generic-dropdown.component.html',
  styleUrls: ['./generic-dropdown.component.scss'],
  providers: [HarshifyPipe],
})
export class GenericDropdownComponent implements OnInit {
  public buttonId: string = '';
  public dropdownId: string = '';
  /* Input */
  @Input() labelTitle: string = '';
  @Input() placeholder: string | number = '';
  @Input() labelClasses: string = '';
  @Input() buttonClasses: string =
    'bef-btn-white bef-fs-1rem bef-text-btnBG bef-p-1rem bef-r-1rem';
  @Input() listClasses: string = '';
  @Input() disabledClassButton: string = '';
  @Input() options: IOptionDropdown[] = [];
  @Input() disabled: boolean = false;
  @Input() withSearcher: boolean = false;
  @Input() multiselect: boolean = false;

  public searcher: any = { search: '' };
  public splitter: string = String.fromCharCode(219);
  public splitterRegEx: RegExp = new RegExp(this.splitter, 'g');
  /* Output */
  @Output() clickedTitle = new EventEmitter<string | number>();
  @Output() clicked = new EventEmitter<IOptionDropdown>();

  @Output() changesInput = new EventEmitter<any>();
  @Output() buttonIdEmit = new EventEmitter<string>();
  @Output() dropdownIdEmit = new EventEmitter<string>();
  constructor(
    private _sharedService: SharedService,
    private _harshifyPipe: HarshifyPipe
  ) {}
  ngOnInit(): void {
    this.buttonId = this._harshifyPipe.transform(9, 'letters');
    this.buttonIdEmit.emit(this.buttonId);
    this.dropdownId = this._harshifyPipe.transform(9, 'letters');
    this.dropdownIdEmit.emit(this.dropdownId);
    this.searcher.search = '';
    this.cssCreate();
  }

  getOptions(): IOptionDropdown[] {
    if (!!this.withSearcher) {
      let searchRegex = new RegExp(this.searcher.search, 'gi');
      return this.options.filter((o: IOptionDropdown) => {
        //return o.option.includes(this.searcher.search);
        return o.option.match(searchRegex);
      });
    } else {
      return this.options;
    }
  }

  InputReacher(event: any) {
    this.changesInput.emit(event);
  }

  onClicked(event: IOptionDropdown) {
    setTimeout(() => {
      this.searcher.search = '';
    }, 100);
    if (!!this.multiselect) {
      if (this.placeholder !== '' && typeof this.placeholder !== 'number') {
        let placeholderSplit = this.placeholder.split(this.splitter);
        if (placeholderSplit.includes(event.option)) {
          let i = placeholderSplit.indexOf(event.option);
          placeholderSplit.splice(i, 1);
        } else {
          placeholderSplit.push(event.option);
        }
        this.placeholder = placeholderSplit.join(this.splitter);
      } else {
        this.placeholder = event.option;
      }
      let newEvent: IOptionDropdown = {
        type: 'menuitemMultiselect',
        option: event.option,
        click: event.click,
      };
      newEvent.option = event.option.replace(event.option, this.placeholder);
      this.clicked.emit(newEvent);
    } else {
      this.clicked.emit(event);
    }
  }

  checkElementWidth(elementId: string): number {
    return this._sharedService.checkElementWidth(elementId);
  }

  cssCreate() {
    this._sharedService.cssCreate();
  }
}
