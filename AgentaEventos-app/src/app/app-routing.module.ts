import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Components */
import { HomeComponent } from './core/components/home/home.component';
import { ErrorComponent } from './core/components/error/error.component';
import { AboutComponent } from './core/components/about/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'evento',
    loadChildren: () =>
      import('src/app/evento/evento.module').then((m) => m.EventoModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('src/app/user/user.module').then((m) => m.UserModule),
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
