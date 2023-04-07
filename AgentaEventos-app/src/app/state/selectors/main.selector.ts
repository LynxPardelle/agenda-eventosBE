import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { IMainState } from 'src/app/core/interfaces/main.state';
export const MainSelector = (state: AppState) => state.main;
export const MainLoadedSelector = createSelector(
  MainSelector,
  (state: IMainState) => state.loading
);

export const MainMainSelector = createSelector(
  MainSelector,
  (state: IMainState) => state.main
);
