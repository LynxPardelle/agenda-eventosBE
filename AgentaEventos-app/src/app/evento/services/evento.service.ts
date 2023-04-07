import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/* Environment */
import { environment } from 'src/environments/environment';
/* RxJs */
import { Observable } from 'rxjs';
/* Interfaces */
import { IEvento } from '../interfaces/evento';
import { IActivity } from '../interfaces/activity';
import { ITicket } from '../interfaces/ticket';
import { ICalification } from '../interfaces/calification';
@Injectable({
  providedIn: 'root',
})
export class EventoService {
  public url: string = environment.api + '/evento/';
  constructor(private _http: HttpClient) {}
  /* Create */
  createActivity(activity: IActivity, eventId: string): Observable<any> {
    return this._http.post<any>(
      `${this.url}activity/${eventId}`,
      JSON.stringify(activity)
    );
  }
  createCalification(
    calification: ICalification,
    type: 'evento' | 'actividad',
    objId: string
  ): Observable<any> {
    return this._http.post<any>(
      `${this.url}calification/${type}/${objId}`,
      JSON.stringify(calification)
    );
  }
  createEvento(evento: IEvento): Observable<any> {
    return this._http.post<any>(`${this.url}evento`, JSON.stringify(evento));
  }
  createTicket(
    ticket: ITicket,
    userId: string,
    eventoId: string
  ): Observable<any> {
    return this._http.post<any>(
      `${this.url}ticket/${userId}/${eventoId}`,
      JSON.stringify(ticket)
    );
  }
  /* Read */
  getEvento(eventoID: string): Observable<any> {
    return this._http.get<any>(`${this.url}evento/${eventoID}`);
  }
  getEventos(
    page: number,
    limit: number = 5,
    sort: string = '_id',
    type: string = 'all',
    search: string = ''
  ): Observable<any> {
    return this._http.get<any>(
      `${this.url}eventos/${page}/${limit}/${sort}/${type}/${search}`
    );
  }
  getActivity(activityID: string, firstOpen: boolean = false): Observable<any> {
    return this._http.get<any>(
      `${this.url}activity/${activityID}${!!firstOpen ? `/${firstOpen}` : ''}`
    );
  }
  /* Put */
  updateActivity(
    activity: IActivity,
    type: string = 'update'
  ): Observable<any> {
    return this._http.put<any>(
      `${this.url}activity/${type}`,
      JSON.stringify(activity)
    );
  }
  updateCalification(
    calification: ICalification,
    type: string = 'update'
  ): Observable<any> {
    return this._http.put<any>(
      `${this.url}calification/${type}`,
      JSON.stringify(calification)
    );
  }
  updateEvento(evento: IEvento, type: string = 'update'): Observable<any> {
    return this._http.put<any>(
      `${this.url}evento/${type}`,
      JSON.stringify(evento)
    );
  }
  updateTicket(ticket: ITicket, type: string = 'update'): Observable<any> {
    return this._http.put<any>(
      `${this.url}ticket/${type}`,
      JSON.stringify(ticket)
    );
  }
  /* Delete */
  deleteFile(
    typeObj: 'evento' | 'actividad',
    type: 'logo' | 'headerImage' | 'photos',
    idObj: string,
    id: string
  ): Observable<any> {
    return this._http.delete<any>(
      `${this.url}file/${typeObj}/${type}/${idObj}/${id}`
    );
  }
}
