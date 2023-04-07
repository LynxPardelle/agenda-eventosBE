import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
/* RxJs */
import { Observable, catchError, throwError } from 'rxjs';
/* Store */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { TokenSelector } from 'src/app/state/selectors/sesion.selector';
import { LoadSesion } from 'src/app/state/actions/sesion.actions';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  public token: string | undefined;
  public excludedList: string[] = ['login'];
  /* Store */
  public token$: Observable<string | undefined>;
  constructor(private store: Store<AppState>) {
    this.token$ = store.select(TokenSelector);
    this.token$.subscribe({
      next: (t: string | undefined) => {
        if (!!t) {
          this.token = t;
        }
      },
      error: (e) => console.error(e),
    });
    this.store.dispatch(LoadSesion());
  }

  /*
  let\sheaders\s=\snew HttpHeaders\(\{\r?\s+'Content-Type': 'application/json',\r?\s+Authorization: this._userService.getToken\(\),\r?\s+\}\);
  */

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const reqClone: HttpRequest<unknown> =
      !!this.token && !this.excludeListChecker(req.url)
        ? req.clone({
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: this.token,
            }),
          })
        : req.clone({
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
          });
    return next.handle(reqClone).pipe(catchError(this.handleError));
  }

  excludeListChecker(url: string): boolean {
    let itHasIt: boolean = false;
    for (let e of this.excludedList) {
      itHasIt = url.includes(e);
    }
    return itHasIt;
  }

  handleError(e: HttpErrorResponse) {
    console.error(e);
    let eMessage = e.error && e.error.message ? e.error.message : e.message;
    return throwError(() => new Error(eMessage));
  }
}
