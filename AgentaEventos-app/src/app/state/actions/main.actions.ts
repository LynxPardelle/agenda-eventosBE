import { createAction, props } from '@ngrx/store';
import { IMain } from 'src/app/core/interfaces/main';

export const LoadMain = createAction('[Main] Loading Main');
export const MainLoaded = createAction(
  '[Main] Main Loaded',
  props<{ main: IMain }>()
);
export const ErrorMain = createAction(
  '[Main] Error Main',
  props<{ error: any }>()
);
