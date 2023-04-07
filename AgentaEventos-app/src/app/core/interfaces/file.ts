import { IUser } from 'src/app/user/interfaces/user';

export interface IFile {
  location: string;
  title: string;
  size: string;
  type: string;
  owner: IUser | null;
  createAt: Date;
}
