import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Modules */
import { EventoRoutingModule } from './evento-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
/* Componets */
import { EventoComponent } from './components/evento/evento.component';
import { EventoListComponent } from './components/evento-list/evento-list.component';
import { ActivityComponent } from './components/activity/activity.component';

@NgModule({
  declarations: [EventoComponent, EventoListComponent, ActivityComponent],
  imports: [CommonModule, EventoRoutingModule, SharedModule],
  exports: [EventoComponent, EventoListComponent],
})
export class EventoModule {}
