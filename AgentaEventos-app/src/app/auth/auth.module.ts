import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from 'src/app/auth/auth-routing.module';

/* Modules */
import { SharedModule } from 'src/app/shared/shared.module';

/* Components */
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { RecoverComponent } from './components/recover/recover.component';

@NgModule({
  declarations: [LoginComponent, RecoverComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule],
})
export class AuthModule {}
