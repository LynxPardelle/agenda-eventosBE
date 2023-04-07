import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Components */
import { EventoComponent } from './components/evento/evento.component';
import { EventoListComponent } from './components/evento-list/evento-list.component';
/* Guards */
import { isAuth } from 'src/app/auth/guard/auth.guard';
const routes: Routes = [
  { path: 'evento', component: EventoComponent, canActivate: [() => isAuth()] },
  { path: 'evento/:id', component: EventoComponent },
  {
    path: 'evento-list',
    component: EventoListComponent,
    canActivate: [() => isAuth()],
  },
  {
    path: 'evento-list/:page',
    component: EventoListComponent,
    canActivate: [() => isAuth()],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoRoutingModule {}
