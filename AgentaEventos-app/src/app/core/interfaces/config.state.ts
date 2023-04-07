import { IConfig } from './config';

export interface IConfigState {
  loading: boolean;
  config?: IConfig;
}
