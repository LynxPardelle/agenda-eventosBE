import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
/* RxJs */
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/* Interfaces */
import { ISesion } from 'src/app/auth/interfaces/sesion';
import { IMainState } from 'src/app/core/interfaces/main.state';
import { IConfigState } from 'src/app/core/interfaces/config.state';
import { IUser } from 'src/app/user/interfaces/user';
import { ITicket } from 'src/app/evento/interfaces/ticket';
/* Services */
import { SharedService } from 'src/app/shared/services/shared.service';
/* State */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { CloseSesion, LoadSesion } from 'src/app/state/actions/sesion.actions';
import { ConfigSelector } from 'src/app/state/selectors/config.selector';
import { SesionSelector } from 'src/app/state/selectors/sesion.selector';
import { MainSelector } from 'src/app/state/selectors/main.selector';
import { LoadConfig } from 'src/app/state/actions/config.actions';
import { LoadMain } from 'src/app/state/actions/main.actions';
/* Lib */
import Swal from 'sweetalert2';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public config$: Observable<IConfigState>;
  public sesion$: Observable<ISesion | undefined>;
  public main$: Observable<IMainState>;
  public identity: IUser | undefined;
  public menuOptions: { option: string; link?: string; click?: string }[] = [];
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private location: Location,
    private _router: Router,
    private _sharedService: SharedService,
    private store: Store<AppState>
  ) {
    this.config$ = this.store.select(ConfigSelector);
    this.sesion$ = this.store.select(SesionSelector);
    this.main$ = this.store.select(MainSelector);
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getConfig();
    this.getSesion();
    this.getMain();
    this.store.dispatch(LoadSesion());
    this.store.dispatch(LoadConfig());
    this.store.dispatch(LoadMain());
    this.cssCreate();
  }
  ngOnDestroy() {
    this._unsubscribeAll.complete();
  }
  getSesion() {
    this.sesion$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (s: ISesion | undefined) => {
        this.identity = !!s?.identity ? s.identity : this.identity;
        this.menuOptions = [];
        if (!!this.identity) {
          this.menuOptions.push({
            option: 'Mi perfil de usuario',
            link: '/user/user/' + this.identity._id,
          });
          this.menuOptions.push({ option: '' });
          if (this.identity.tickets[0] && this.identity.tickets[0].evento) {
            if (this.identity.tickets[1]) {
              this.menuOptions.push({ option: 'Mis Eventos' });
            }
            this.identity.tickets.forEach((t: ITicket) => {
              this.menuOptions.push({
                option: t.evento?.title ? t.evento.title : 'Ir a mi evento',
                link:
                  '/evento/evento/' + (t.evento?._id ? t.evento._id : t.evento),
              });
            });
            this.menuOptions.push({ option: '' });
          }
          if (
            this._sharedService.checkRole(
              this.identity.roleType,
              this.identity.generalRole,
              'premium'
            )
          ) {
            this.menuOptions.push({
              option: 'Ir a lista de Eventos',
              link: '/evento/evento-list',
            });
          }
          if (
            this._sharedService.checkRole(
              this.identity.roleType,
              this.identity.generalRole,
              'special'
            )
          ) {
            this.menuOptions.push({
              option: 'Ir a lista de Usuarios',
              link: '/user/user-list',
            });
          }
          this.menuOptions.push({ option: '' });
          this.menuOptions.push({
            option: 'Cambiar de sesión',
            link: '/auth/login',
          });
          this.menuOptions.push({ option: 'Cerrar sesión', click: 'logout' });
        } else {
          this.menuOptions.push({
            option: 'Iniciar de sesión',
            link: '/auth/login',
          });
          this.menuOptions.push({
            option: 'Regístrate',
            link: '/user/user',
          });
        }
        this.menuOptions.push({ option: '' });
        this.menuOptions.push({
          option: 'Acerca de nosotros',
          link: '/about',
        });
      },
      error: (e) => {
        this._sharedService.consoleLog(e, null, 'padding: 1rem;', 'error');
        Swal.fire(
          'Error al cargar la información del usuario',
          e.toString(),
          'error'
        );
      },
    });
  }
  getConfig() {
    this.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (c) => {
        if (c.config) {
          // this._sharedService.consoleLog(c.config);
        }
      },
      error: (e) => {
        this._sharedService.consoleLog(e, null, 'padding: 1rem;', 'error');
        Swal.fire(
          'Error al cargar la configuración del sitio',
          e.toString(),
          'error'
        );
      },
    });
  }
  getMain() {
    this.main$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (c) => {
        if (c.main) {
          // this._sharedService.consoleLog(c.main);
        }
      },
      error: (e) => {
        this._sharedService.consoleLog(e, null, 'padding: 1rem;', 'error');
        Swal.fire(
          'Error al cargar la información del sitio',
          e.toString(),
          'error'
        );
      },
    });
  }
  clicked(type: string) {
    switch (true) {
      case type === 'logout':
        Swal.fire({
          title: '¿Quieres cerrar sesión?',
          icon: 'warning',
          showDenyButton: true,
          confirmButtonText: 'Si',
          denyButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            this.logOut();
          } else {
            Swal.fire('No se ha cerrado sesión', '', 'info');
          }
        });
        break;
      default:
        break;
    }
  }
  logOut(): void {
    this.store.dispatch(CloseSesion());
    this.store.dispatch(LoadSesion());
    this._router.navigate(['/auth/login']);
    Swal.fire('Sesión cerrada', '', 'success');
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
