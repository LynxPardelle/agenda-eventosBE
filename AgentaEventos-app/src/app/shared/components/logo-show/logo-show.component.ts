import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'logo-show',
  templateUrl: './logo-show.component.html',
  styleUrls: ['./logo-show.component.scss'],
})
export class LogoShowComponent implements OnInit {
  @Input() logoWidth: string = '100px';
  @Input() logoHeight: string = '100px';
  @Input() logo: string = 'logo';
  @Input() classes: string =
    'd-block mx-auto bef-my-2rem bef-backgroundPosition-center__center bef-backgroundSize-contain bef-backgroundRepeat-noMINrepeat bef-backgroundOrigin-contentMINbox';
  constructor(private _sharedService: SharedService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cssCreate();
  }
  cssCreate() {
    this._sharedService.cssCreate();
  }
}
