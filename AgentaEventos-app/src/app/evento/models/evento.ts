import { IUser } from 'src/app/user/interfaces/user';
import { IActivity } from '../interfaces/activity';
import { ICalification } from '../interfaces/calification';
import { IEvento } from '../interfaces/evento';
import { IWitness } from '../interfaces/witness';
import { ITicket } from '../interfaces/ticket';
import { IFile } from 'src/app/core/interfaces/file';

export class Evento implements IEvento {
  constructor(
    public _id: string,
    public logo: IFile | null,
    public headerImage: IFile | null,
    public description: string,
    public title: string,
    public subtitle: string,
    public activities: IActivity[],
    public califications: ICalification[],
    public witness: IWitness[],
    public asistents: IUser[],
    public operators: IUser[],
    public ticketTypes: number,
    public photos: IFile[],
    public date: Date,
    public place: string,
    public titleColor: string,
    public textColor: string,
    public linkColor: string,
    public bgColor: string,
    public tickets: ITicket[],
    public createAt: Date,
    public changeDate: Date,
    public changeUser: IUser | null,
    public changeType: string,
    public ver: number,
    public isDeleted: boolean,
    public changeHistory: IEvento[]
  ) {}
}
