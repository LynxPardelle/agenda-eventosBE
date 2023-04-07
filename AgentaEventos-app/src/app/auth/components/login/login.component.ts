import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
/* Interfaces */
/* Services */
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from '../../services/auth.service';
/* Store */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { SesionLoaded } from 'src/app/state/actions/sesion.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';
  public lockeds: { [key: string]: boolean } = { email: true, password: true };

  constructor(
    private location: Location,
    private _router: Router,
    private _sharedService: SharedService,
    private _authService: AuthService,
    private store: Store<AppState>
  ) {}
  onSubmit() {
    this._authService
      .login({ email: this.email, password: this.password, gettoken: true })
      .subscribe({
        next: (response) => {
          if (!!response.user && !!response.token) {
            this.store.dispatch(
              SesionLoaded({
                sesion: {
                  active: true,
                  identity: response.user,
                  token: response.token,
                },
              })
            );
            this._router.navigate(['/home']);
          } else {
            this._sharedService.consoleParser({
              thing:
                'Hubo un error al iniciar sesión: No se pudo traer al usuario o las llaves de autenticación.',
              type: 'error',
            });
          }
        },
        error: (error) => {
          this._sharedService.consoleParser({ thing: error, type: 'error' });
        },
      });
  }
  changesInput(thing: any) {
    Object.keys(this.lockeds).forEach((lockedInput) => {
      this.lockeds[lockedInput] = thing[lockedInput]
        ? thing.locked
        : this.lockeds[lockedInput];
    });
    switch (true) {
      case !!thing['email']:
        this.email = thing['email'];
        break;
      case !!thing['password']:
        this.password = thing['password'];
        break;
      default:
        break;
    }
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
