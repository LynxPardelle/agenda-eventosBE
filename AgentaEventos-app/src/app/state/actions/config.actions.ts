import { createAction, props } from '@ngrx/store';
import { IConfig } from 'src/app/core/interfaces/config';

export const LoadConfig = createAction('[Config] Loading Config');
export const ConfigLoaded = createAction(
  '[Config] Config Loaded',
  props<{ config: IConfig }>()
);
export const ErrorConfig = createAction(
  '[Config] Error Config',
  props<{ error: any }>()
);
