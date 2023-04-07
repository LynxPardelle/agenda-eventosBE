import { ITicket } from 'src/app/evento/interfaces/ticket';
import { IUser } from '../interfaces/user';

export class User implements IUser {
  constructor(
    public _id: string,
    public name: string,
    public roleType: 'basic' | 'premium' | 'special',
    public generalRole: 'asistente' | 'operador' | 'administrador' | 'técnico',
    public tickets: ITicket[],
    public email: string,
    public password: string,
    public lastPassword: string,
    public passRec: string,
    public verified: boolean,
    public uses: number,
    public createAt: Date,
    public changeDate: Date,
    public changeUser: IUser | null,
    public changeType: string,
    public ver: number,
    public isDeleted: boolean,
    public changeHistory: IUser[]
  ) {}
}
