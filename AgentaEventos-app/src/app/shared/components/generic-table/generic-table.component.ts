import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
/* RxJs */
import { Subject } from 'rxjs';
/* Interfaces */
import { IUploadActions, TUploadActions } from '../../interfaces/uploadActions';
import { IActionTable } from '../../interfaces/actionTable';
import { ISpecialCell } from '../../interfaces/specialCell';
import { IStoredSpecialCell } from '../../interfaces/storedSpecialCell';
/* Services */
import { SharedService } from '../../services/shared.service';
/* Material */
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})
export class GenericTableComponent implements OnInit, AfterViewInit {
  public hoverRow: any = null;
  public selectedRow: any = null;
  /* Input */
  @Input() public displayedColumns: string[] = [];
  @Input() public dataSource: any = new MatTableDataSource([]);
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
  @Input() public tableClasses: string =
    'bef bef-bg-mainBG bef-borderColor-mainText__OPA__0_25 bef-borderStyle-solid bef-borderWidth-2px__0';
  @Input() public headerRowClasses: string = '';
  @Input() public headerClasses: string =
    'text-center text-uppercase bef-p-1rem__2rem text-break text-nowrap font-weight-bold text-center bef-text-btnBG bef-fs-1rem bef-lh-1 ';
  @Input() public rowClasses: string =
    'text-center bef bef-p-1rem__2rem bef-borderColor-mainText__OPA__0_25 bef-borderStyle-solid bef-borderWidth-1px__0 bef-borderStyle-solid bef-text-mainText';
  @Input() public cellClasses: string = '';
  @Input() public hoverRowClasses: string = 'bef-bg-mainText__OPA__0_25';
  @Input() public selectedRowClasses: string = 'bef-bg-btnBG__OPA__0_5';
  @Input() public actionClasses: string = 'bef-text-btnBG';
  @Input() public paginatorClasses: string =
    'bef-bg-btnBG bef-text-white bef-r-1rem';
  @Input() public buttonClasses: string =
    'bef-m-0__auto__3_5rem bef-m-sm-3_5rem__auto bef-wmx-75vw bef-bg-btnBG bef-text-white bef-p-0_25rem bef-m-3_5rem__auto bef-r-1rem';
  @Input() public listClasses: string = 'text-center';
  @Input() currentSort: string = '';
  @Input() public dateFormat: string =
    'dd/MM/yyyy HH:mm' /* "dd/MM/yyyy hh:mm" */;
  /* Output */
  @Output() doAction = new EventEmitter<IActionTable>();
  @Output() changePage = new EventEmitter<number>();
  @Output() changePageSize = new EventEmitter<number>();
  @Output() sorted = new EventEmitter<any>();
  @Output() clicked = new EventEmitter<any>();
  @Output() changesInput = new EventEmitter<any>();
  @Output() buttonId = new EventEmitter<any>();
  @Output() recoverThing = new EventEmitter<any>();
  @Output() recoverSelected = new EventEmitter<any>();
  constructor(private _sharedService: SharedService) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    if (!!this.sortActive) {
      this.dataSource.sort = this.sort;
    }
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.cssCreate();
  }
  changeRowHover(row: any): void {
    this.hoverRow = row;
  }
  changeRowSelected(row: any): void {
    this.selectedRow = row;
    this.recoverSelected.emit(this.selectedRow);
  }
  checkIfHovered(element: any, displayColumn: string): boolean {
    return this.hoverRow === element && displayColumn !== 'actions';
  }
  checkIfSelected(element: any, displayColumn: string): boolean {
    return this.selectedRow === element && displayColumn !== 'actions';
  }
  getCellClasses(displayedColumns: string[], i: number, element: any): string {
    let newClass: string = `bef ${this.cellClasses}`;

    if (displayedColumns[i] !== 'actions') {
      newClass = `${newClass} bef-bordery-0_125rem`;
    } else {
      newClass = `${newClass} bef-borderb-0 ${this.actionClasses}`;
    }
    if (
      (displayedColumns[0] !== 'actions' && i === 0) ||
      (displayedColumns[0] === 'actions' && i === 1)
    ) {
      newClass = `${newClass} bef-roundeds-1rem bef-borders-0_125rem`;
    }
    if (
      (displayedColumns[displayedColumns.length - 1] !== 'actions' &&
        i === displayedColumns.length - 1) ||
      (displayedColumns[displayedColumns.length - 1] === 'actions' &&
        i === displayedColumns.length - 2)
    ) {
      newClass = `${newClass} bef-roundede-1rem`;
    }
    if (i === displayedColumns.length - 1) {
      newClass = `${newClass} bef-bordere-0_125rem`;
    }
    if (this.hoverRow === element && displayedColumns[i] !== 'actions') {
      newClass = `${newClass} ${this.hoverRowClasses}`;
    }
    if (this.selectedRow === element && displayedColumns[i] !== 'actions') {
      newClass = `${newClass} ${this.selectedRowClasses}`;
    }
    if (
      !!element.rowClass &&
      displayedColumns[i] !== 'actions' &&
      this.selectedRow !== element &&
      this.hoverRow !== element
    ) {
      newClass += ` ${element.rowClass}`;
    }
    return newClass;
  }
  checkIfHoverRow(row: any): boolean {
    return this.hoverRow === row;
  }
  checkIfSelectedRow(row: any): boolean {
    return this.selectedRow === row;
  }
  contentChanged() {}
  sortChange(sortState: Sort) {
    if (!!this.sortActive) {
      this.sorted.emit(sortState);
    }
  }
  checkIfDate(element: string): boolean {
    return this._sharedService.checkIfDate(element);
  }
  changePageSize2Emit(s: string) {
    this.changePageSize.emit(parseInt(s));
  }
  parseAction(action: IActionTable, thing: any) {
    action.object = thing;
    this.doAction.emit(action);
  }
  getType(thing: any) {
    return typeof thing;
  }

  getSortDirection(): 'asc' | 'desc' {
    return this.currentSort.includes('-') ? 'desc' : 'asc';
  }
  cssCreate(): void {
    this._sharedService.cssCreate();
  }
}
