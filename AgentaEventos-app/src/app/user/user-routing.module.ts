import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* Components */
import { UserComponent } from './components/user/user.component';
import { UserListComponent } from './components/user-list/user-list.component';
/* Guards */
import { isAuth } from 'src/app/auth/guard/auth.guard';
const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'user/:id', component: UserComponent },
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [() => isAuth()],
  },
  {
    path: 'user-list/:page',
    component: UserListComponent,
    canActivate: [() => isAuth()],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
