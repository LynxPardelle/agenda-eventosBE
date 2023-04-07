import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
/* Services */
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss'],
})
export class RecoverComponent implements OnInit {
  public email: string = '';
  public password: string = '';
  public passwordRe: string = '';
  /* FIXME: change this when we change the type of the page that we are. */
  public lockeds: { [key: string]: boolean } = {
    email: true,
    /* password: true,
    passwordRe: true, */
  };
  public recoverCode: string = '';
  public userId: string = '';

  constructor(
    private location: Location,
    private _router: Router,
    private _route: ActivatedRoute,
    private _sharedService: SharedService
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._route.params.subscribe((params) => {
      this.userId = params['userId'] ? params['userId'] : '';
      this.recoverCode = params['recoverCode'] ? params['recoverCode'] : '';
      this.lockeds =
        this.userId !== '' && this.recoverCode !== ''
          ? {
              password: true,
              passwordRe: true,
            }
          : {
              email: true,
            };
    });
    this.cssCreate();
  }
  onSubmit() {
    this._sharedService.consoleLog('onSubmit');
  }
  changesInput(thing: any) {
    Object.keys(this.lockeds).forEach((lockedInput) => {
      this.lockeds[lockedInput] = thing[lockedInput]
        ? thing.locked
        : this.lockeds[lockedInput];
    });
    if (this.checkIfFormValid()) this.cssCreate();
  }
  checkIfFormValid() {
    return Object.values(this.lockeds).every((locked) => locked === false);
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
