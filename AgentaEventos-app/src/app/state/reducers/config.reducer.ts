import { createReducer, on } from '@ngrx/store';
import { IConfigState } from 'src/app/core/interfaces/config.state';
import * as ConfigActions from '../actions/config.actions';
/* Environment */
import { environment } from '../../../environments/environment';
const initialState: IConfigState = {
  loading: false,
};

const APLICATION: string = environment.app;

export const ConfigReducer = createReducer(
  initialState,
  on(ConfigActions.LoadConfig, (s) => {
    return { ...s, loading: true };
  }),
  on(ConfigActions.ConfigLoaded, (s, { config }) => {
    sessionStorage.setItem(APLICATION + 'config', JSON.stringify(config));
    return { ...s, loading: false, config: config };
  }),
  on(ConfigActions.ErrorConfig, (s, e) => {
    console.trace();
    console.error(e.error);
    sessionStorage.removeItem(APLICATION + 'config');
    return { ...s, loading: false };
  })
);
