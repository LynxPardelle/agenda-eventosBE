import { IUser } from 'src/app/user/interfaces/user';

export interface IWitness {
  witness: IUser | null;
  createAt: Date;
}
