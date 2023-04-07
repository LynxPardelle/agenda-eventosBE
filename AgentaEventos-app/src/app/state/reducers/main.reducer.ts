import { createReducer, on } from '@ngrx/store';
import { IMainState } from 'src/app/core/interfaces/main.state';
import * as MainActions from '../actions/main.actions';
const initialState: IMainState = {
  loading: false,
};

export const MainReducer = createReducer(
  initialState,
  on(MainActions.LoadMain, (s) => {
    return { ...s, loading: true };
  }),
  on(MainActions.MainLoaded, (s, { main }) => {
    return { ...s, loading: false, main: main };
  }),
  on(MainActions.ErrorMain, (s, e) => {
    console.error(e.error);
    return { ...s, loading: false };
  })
);
