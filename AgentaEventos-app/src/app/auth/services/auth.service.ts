import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/* Environment */
import { environment } from 'src/environments/environment';
/* RxJs */
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public url: string = environment.api + '/user/';
  constructor(private _http: HttpClient) {}
  login(user: {
    email: string;
    password: string;
    gettoken?: boolean;
  }): Observable<any> {
    return this._http.post<any>(`${this.url}login`, JSON.stringify(user));
  }
}
