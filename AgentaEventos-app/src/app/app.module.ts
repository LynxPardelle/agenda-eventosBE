import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/* Shared Module */
import { SharedModule } from './shared/shared.module';

/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './core/components/home/home.component';
import { ErrorComponent } from './core/components/error/error.component';

/* Interceptors */
import { TokenInterceptor } from './core/interceptors/token.interceptor';

/* Store */
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ROOT_REDUCERS } from 'src/app/state/app.state';
import { SesionEffects } from './state/effects/sesion.effects';
import { ConfigEffects } from './state/effects/config.effects';
import { MainEffects } from './state/effects/main.effects';

/* Environment */
import { environment } from '../environments/environment';

/* Language */
import localEs from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { AboutComponent } from './core/components/about/about.component';
registerLocaleData(localEs);

const APLICATION: string = environment.app;
@NgModule({
  declarations: [AppComponent, HomeComponent, ErrorComponent, AboutComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    /* Shared Module */
    SharedModule,
    /* Store */
    StoreModule.forRoot(ROOT_REDUCERS),
    EffectsModule.forRoot([SesionEffects, ConfigEffects, MainEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      name: APLICATION + 'App',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-mx' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
