import { Component, OnDestroy, OnInit } from '@angular/core';
/* RxJs */
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/* Interfaces */
import { ISesion } from './auth/interfaces/sesion';
import { IMainState } from './core/interfaces/main.state';
import { IConfigState } from './core/interfaces/config.state';
/* Services */
import { SharedService } from './shared/services/shared.service';
import { SplashScreenService } from './shared/services/splash-screen.service';
/* State */
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { SesionSelector } from './state/selectors/sesion.selector';
import { ConfigSelector } from './state/selectors/config.selector';
import { LoadSesion } from './state/actions/sesion.actions';
import { MainSelector } from './state/selectors/main.selector';
import { LoadConfig } from './state/actions/config.actions';
import { LoadMain } from './state/actions/main.actions';
/* Bef */
import { NgxBootstrapExpandedFeaturesService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public config$: Observable<IConfigState>;
  public sesion$: Observable<ISesion | undefined>;
  public main$: Observable<IMainState>;
  public today: Date = new Date();
  private _unsubscribeAll: Subject<any>;
  constructor(
    private store: Store<AppState>,
    private _befService: NgxBootstrapExpandedFeaturesService,
    private _sharedService: SharedService,
    private _splashScreenService: SplashScreenService
  ) {
    this._unsubscribeAll = new Subject();
    this.config$ = this.store.select(ConfigSelector);
    this.sesion$ = this.store.select(SesionSelector);
    this.main$ = this.store.select(MainSelector);
  }

  ngOnInit(): void {
    this.getConfig();
    this.getSesion();
    this.getMain();
    this._splashScreenService.hide();
    this.store.dispatch(LoadSesion());
    this.store.dispatch(LoadConfig());
    this.store.dispatch(LoadMain());
    this._befService.pushColors({
      logo: "url('../../favicon.ico')",
      //logo: "url('')",
      mainText: '#1e1e1e',
      mainBG: '#F5FAFF',
      btnBG: '#00254D',
      resaltaBG: '#7749F8',
      // mainText: '#F5e7a0',
      // mainBG: '#1e3e5e',
      // btnBG: '#55e7a0',
      // resaltaBG: '#f5a700',
    });
    this._befService.updateClasses(['bef-btn-btnBG', 'bef-r-0_5rem']);
    this.cssCreate();
  }

  ngOnDestroy() {
    this._unsubscribeAll.complete();
  }

  getSesion() {
    this.sesion$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (s) => {
        /* if (
          (!s?.identity || !s?.token) &&
          !this._router.url.includes('/auth/')
        ) {
          this._router.navigate(['/auth/login']);
        }
        */
        // this._sharedService.consoleLog(this._route.url);
        this.cssCreate();
      },
      error: (e) => {
        this._sharedService.consoleLog(e, null, 'padding: 1rem;', 'error');
      },
    });
  }

  getConfig() {
    this.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (c) => {
        if (c.config) {
          // this._sharedService.consoleLog(c.config);
        }
        this.cssCreate();
      },
      error: (e) => {
        this._sharedService.consoleLog(e, null, 'padding: 1rem;', 'error');
      },
    });
  }

  getMain() {
    this.main$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (c) => {
        if (c.main) {
          // this._sharedService.consoleLog(c.main);
        }
        this.cssCreate();
      },
      error: (e) => {
        this._sharedService.consoleLog(e, null, 'padding: 1rem;', 'error');
      },
    });
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
