import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/* Environment */
import { environment } from 'src/environments/environment';
/* RxJs */
import { Observable } from 'rxjs';
/* Interfaces */
import { IUser } from 'src/app/user/interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  public url: string = environment.api + '/user/';
  constructor(private _http: HttpClient) {}
  /* Create */
  register(user: IUser): Observable<any> {
    return this._http.post<any>(`${this.url}user`, JSON.stringify(user));
  }
  /* Read */
  getUser(userID: string, thing: string = '_id'): Observable<any> {
    return this._http.get<any>(`${this.url}user/${userID}/${thing}`);
  }
  getUsers(
    page: number,
    limit: number = 5,
    sort: string = '_id',
    type: string = 'all',
    search: string = ''
  ): Observable<any> {
    return this._http.get<any>(
      `${this.url}users/${page}/${limit}/${sort}/${type}/${search}`
    );
  }
  /* Put */
  updateUser(user: IUser, type: string = 'update'): Observable<any> {
    return this._http.put<any>(`${this.url}user/${type}`, JSON.stringify(user));
  }
}
