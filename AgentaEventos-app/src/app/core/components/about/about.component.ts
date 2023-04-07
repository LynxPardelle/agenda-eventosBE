import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(
    private location: Location,
    private _sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.cssCreate();
  }
  getHTML(type: string): string {
    return this._sharedService.getHTML(type);
  }
  returnToPreviousPage() {
    this.location.back();
  }
  cssCreate() {
    this._sharedService.cssCreate();
  }
}
