import { IUser } from 'src/app/user/interfaces/user';
import { ICalification } from '../interfaces/calification';
import { IWitness } from '../interfaces/witness';
import { IActivity } from '../interfaces/activity';
import { IFile } from 'src/app/core/interfaces/file';

export class Activity implements IActivity {
  constructor(
    public _id: string,
    public ticketType: number,
    public title: string,
    public subtitle: string,
    public description: string,
    public headerImage: IFile | null,
    public photos: IFile[],
    public califications: ICalification[],
    public witness: IWitness[],
    public date: Date,
    public place: string,
    public titleColor: string,
    public textColor: string,
    public linkColor: string,
    public bgColor: string,
    public createAt: Date,
    public changeDate: Date,
    public changeUser: IUser | null,
    public changeType: string,
    public ver: number,
    public isDeleted: boolean,
    public changeHistory: IActivity[]
  ) {}
}
