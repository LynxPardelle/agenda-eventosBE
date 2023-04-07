import { ITicket } from 'src/app/evento/interfaces/ticket';

export interface IUser {
  _id: string;
  name: string;
  roleType: 'basic' | 'premium' | 'special';
  generalRole: 'asistente' | 'operador' | 'administrador' | 'técnico';
  tickets: ITicket[];
  email: string;
  password: string;
  lastPassword: string;
  passRec: string;
  verified: boolean;
  uses: number;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser | null;
  changeType: string;
  ver: number;
  isDeleted: boolean;
  changeHistory: IUser[];
}
