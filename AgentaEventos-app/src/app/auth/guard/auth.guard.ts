import { inject } from '@angular/core';
/* RxJs */
import { Observable, map } from 'rxjs';
/* Interfaces */
import { ISesion } from 'src/app/auth/interfaces/sesion';
import { IRole } from 'src/app/shared/interfaces/role';
/* Store */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { SesionSelector } from 'src/app/state/selectors/sesion.selector';
import { SharedService } from 'src/app/shared/services/shared.service';

sesion$: Observable<ISesion | undefined>;
export const isAuth = (
  type: IRole | '' = '',
  store = inject(Store<AppState>),
  sharedService = inject(SharedService)
) => {
  return store
    .select(SesionSelector)
    .pipe(
      map(
        (sesion: ISesion) =>
          !!sesion.active &&
          (type === '' ||
            (sesion.identity &&
              sharedService.checkRole(
                sesion.identity?.roleType,
                sesion.identity?.generalRole,
                type
              )))
      )
    );
};
