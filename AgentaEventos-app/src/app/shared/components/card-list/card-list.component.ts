import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
/* Interfaces */
import { IActionTable } from 'src/app/shared/interfaces/actionTable';
import { ISpecialCell } from 'src/app/shared/interfaces/specialCell';
import { IStoredSpecialCell } from 'src/app/shared/interfaces/storedSpecialCell';
import {
  IUploadActions,
  TUploadActions,
} from 'src/app/shared/interfaces/uploadActions';
/* Services */
import { SharedService } from 'src/app/shared/services/shared.service';
export interface ISortCard {
  active: string;
  direction: string;
}
@Component({
  selector: 'card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  public currentTabs: any = [];
  public selectedRow: any = null;
  @Input() public displayedColumns: string[] = [];
  @Input() public dataSource: any[] = [];
  @Input() public actions: IActionTable[] = [];
  @Input() public currentPage: number = 1;
  @Input() public pages: number[] = [1];
  @Input() public pageSize: number = 5;
  @Input() public type: string = '';
  @Input() public specialColumns: string[] = [];
  @Input() public getSpecialCell: (value: string) => ISpecialCell = (
    value: string
  ) => {
    return { type: 'customHtml', thing: '' };
  };
  @Input() public customHtml: (event: any) => string = (event: any) => {
    return '';
  };
  @Input() public storedSpecialCells: IStoredSpecialCell[] = [];
  @Input() public sortActive: boolean = true;
  @Input() public paginationActive: boolean = true;
  @Input() public uploadSubject: Subject<IUploadActions | TUploadActions> =
    new Subject<IUploadActions | TUploadActions>();
  @Input() public cardClasses: string = 'bef-text-btnBG';
  @Input() public selectedRowClasses: string = 'bef-bg-mainBG';
  @Input() public actionClasses: string = 'bef-text-btnBG';
  @Input() public paginatorClasses: string =
    'bef-bg-btnBG bef-text-white bef-r-1rem';
  @Input() public buttonClasses: string =
    'bef-m-0__auto__3_5rem bef-m-sm-3_5rem__auto bef-wmx-75vw bef-bg-btnBG bef-text-white bef-p-0_25rem bef-m-3_5rem__auto bef-r-1rem';
  @Input() public listClasses: string = 'text-center';
  @Input() public dateFormat: string =
    'dd/MM/yyyy HH:mm' /* "dd/MM/yyyy hh:mm" */;
  /* Outputs */
  @Output() doAction = new EventEmitter<IActionTable>();
  @Output() changePage = new EventEmitter<number>();
  @Output() changePageSize = new EventEmitter<number>();
  @Output() clicked = new EventEmitter<any>();
  @Output() changesInput = new EventEmitter<any>();
  @Output() buttonId = new EventEmitter<any>();
  @Output() recoverThing = new EventEmitter<any>();
  @Output() recoverSelected = new EventEmitter<any>();
  constructor(private _sharedService: SharedService) {}

  ngOnInit(): void {
    this.cssCreate();
    for (let i = 0; i <= this.dataSource.length; i++) {
      this.currentTabs['_' + i] = 0;
    }
  }
  changeRowSelected(row: any): void {
    this.selectedRow = row;
    this.recoverSelected.emit(this.selectedRow);
  }

  getTrueColumns(): string[] {
    let trueColumns: string[] = [];
    for (let d of this.displayedColumns) {
      if (!this.specialColumns.includes(d) && d !== 'actions') {
        trueColumns.push(d);
      }
    }
    return trueColumns;
  }

  getTabs(): number[] {
    let tabs: number[] = [];
    let columns = this.getTrueColumns();
    let dividers = columns.length / 4;
    for (let i = 1; i <= Math.ceil(dividers); i++) {
      tabs.push(i);
    }
    return tabs;
  }

  getIfActiveType(tab: number, n: number): boolean {
    this.cssCreate();
    return this.currentTabs['_' + tab] === n - 1;
  }

  selectTab(tab: number, n: number) {
    this.currentTabs['_' + tab.toString()] = n;
  }

  getElementsInTab(tab: number): string[] {
    let elements: string[] = [];
    let columns = this.getTrueColumns();
    for (let i = 0; i < columns.length; i++) {
      if (Math.floor(i / 4) === tab - 1) {
        elements.push(columns[i]);
      }
    }
    return elements;
  }

  checkIfDate(element: string): boolean {
    return this._sharedService.checkIfDate(element);
  }

  changePageSize2Emit(s: string) {
    this._sharedService.consoleLog(s);
    this.changePageSize.emit(parseInt(s));
  }

  parseAction(action: IActionTable, thing: any) {
    action.object = thing;
    this.doAction.emit(action);
  }

  cssCreate(): void {
    this._sharedService.cssCreate();
  }
}
