import { IUser } from 'src/app/user/interfaces/user';
import { IFile } from './file';

export interface IMain {
  logo: IFile | null;
  title: string;
  welcome: string;
  titleColor: string;
  textColor: string;
  linkColor: string;
  bgColor: string;
  errorMsg: string;
  seoDesc: string;
  seotags: string;
  seoImg: string;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser | null;
  changeType: string;
  ver: number;
  isDeleted: boolean;
  changeHistory: IMain[];
}
