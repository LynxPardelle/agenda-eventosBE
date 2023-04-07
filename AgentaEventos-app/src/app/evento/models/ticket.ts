import { IUser } from 'src/app/user/interfaces/user';
import { IEvento } from '../interfaces/evento';
import { IActivity } from '../interfaces/activity';
import { ITicket } from '../interfaces/ticket';

export class Ticket implements ITicket {
  constructor(
    public _id: string,
    public type: number,
    public evento: IEvento | null,
    public user: IUser | null,
    public role:
      | 'asistente'
      | 'operador general'
      | 'operador de actividad'
      | 'operador de asistentes',
    public activitiesAdmin: IActivity[],
    public createAt: Date,
    public changeDate: Date,
    public changeUser: IUser | null,
    public changeType: string,
    public ver: number,
    public isDeleted: boolean,
    public changeHistory: ITicket[]
  ) {}
}
