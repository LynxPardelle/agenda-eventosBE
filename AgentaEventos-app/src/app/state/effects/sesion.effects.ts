import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as SesionActions from '../actions/sesion.actions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ISesion } from '../../auth/interfaces/sesion';

@Injectable()
export class SesionEffects {
  private readonly api = environment.api;
  private APLICATION: string = environment.app;

  LoadSesion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SesionActions.LoadSesion),
      mergeMap(() => {
        let identity: string | null = localStorage.getItem(
          this.APLICATION + 'identity'
        );
        let token: string | null = localStorage.getItem(
          this.APLICATION + 'token'
        );
        if (
          identity &&
          identity !== null &&
          identity !== 'undefined' &&
          token &&
          token !== null &&
          token !== 'undefined'
        ) {
          return of({
            identity: JSON.parse(identity),
            token: JSON.parse(token),
          }).pipe(
            map((i: { identity: ISesion; token: string }) => {
              return SesionActions.SesionLoaded({
                sesion: { active: true, identity: i.identity, token: i.token },
              });
            }),
            catchError(() => of(SesionActions.ErrorSesion()))
          );
        } else {
          return of(SesionActions.SesionLoaded({ sesion: { active: false } }));
        }
      })
    )
  );

  constructor(private actions$: Actions, private _http: HttpClient) {}
}
