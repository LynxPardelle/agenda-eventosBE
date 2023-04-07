import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { RecoverComponent } from './components/recover/recover.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'recover/:userId/:recoverCode', component: RecoverComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
