import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/* Environment */
import { environment } from '../../../environments/environment';
/* RxJs */
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
/* Store */
import * as ConfigActions from '../actions/config.actions';

@Injectable()
export class ConfigEffects {
  private APLICATION: string = environment.app;
  LoadConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.LoadConfig),
      mergeMap(() => {
        let config: string | null = sessionStorage.getItem(
          this.APLICATION + 'config'
        );
        if (!!config) {
          config = JSON.parse(config);
        }
        return of({ config: config }).pipe(
          map((r: any) => {
            if (r.config) {
              return ConfigActions.ConfigLoaded({
                config: r.config,
              });
            } else {
              return ConfigActions.ConfigLoaded({
                config: {
                  disabledMenu: false,
                  disabledMenuText: '',
                },
              });
            }
          }),
          catchError((e) => of(ConfigActions.ErrorConfig({ error: e })))
        );
      })
    )
  );
  /*
  LoadDisabledMenu$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.LoadDisabledMenu),
      mergeMap(() => {
        return of(
          ConfigActions.DisabledMenuLoaded({
            disabledMenu: false,
            disabledMenuModalTitle: '',
            disabledMenuModalText: '',
          })
        );
      })
    )
  ); */

  constructor(private actions$: Actions, private _http: HttpClient) {}
}
