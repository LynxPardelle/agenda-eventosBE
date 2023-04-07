import { Injectable } from '@angular/core';
/* RxJs */
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
/* Services */
import { CoreService } from 'src/app/core/services/core.service';
/* Store */
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MainActions from '../actions/main.actions';
@Injectable()
export class MainEffects {
  LoadMainn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MainActions.LoadMain),
      mergeMap(() => {
        return this._coreService.getMain().pipe(
          map((r: any) => {
            if (r.main) {
              return MainActions.MainLoaded({
                main: r.main,
              });
            } else {
              return MainActions.ErrorMain({ error: r });
            }
          }),
          catchError((e) => of(MainActions.ErrorMain({ error: e })))
        );
      })
    )
  );

  constructor(private actions$: Actions, private _coreService: CoreService) {}
}
