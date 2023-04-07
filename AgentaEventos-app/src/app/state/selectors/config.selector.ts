import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { IConfigState } from 'src/app/core/interfaces/config.state';
export const ConfigSelector = (state: AppState) => state.config;
export const ConfigLoadedSelector = createSelector(
  ConfigSelector,
  (state: IConfigState) => state.loading
);

export const ConfigConfigSelector = createSelector(
  ConfigSelector,
  (state: IConfigState) => state.config
);
