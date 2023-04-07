import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/* Environment */
import { environment } from 'src/environments/environment';
/* RxJs */
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  public url: string = environment.api + '/main/';

  constructor(private _http: HttpClient) {}
  /* Get */
  getMain(): Observable<any> {
    return this._http.get<any>(this.url + 'main');
  }
}
