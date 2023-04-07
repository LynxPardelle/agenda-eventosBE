import { IUser } from 'src/app/user/interfaces/user';
import { ICalification } from './calification';
import { IWitness } from './witness';
import { IFile } from 'src/app/core/interfaces/file';

export interface IActivity {
  _id: string;
  ticketType: number;
  title: string;
  subtitle: string;
  description: string;
  headerImage: IFile | null;
  photos: IFile[];
  califications: ICalification[];
  witness: IWitness[];
  date: Date;
  place: string;
  titleColor: string;
  textColor: string;
  linkColor: string;
  bgColor: string;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser | null;
  changeType: string;
  ver: number;
  isDeleted: boolean;
  changeHistory: IActivity[];
}
