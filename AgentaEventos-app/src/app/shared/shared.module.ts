import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Modules */
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxUploaderModule } from 'ngx-uploader';
/* Components */
import { GenericTableComponent } from './components/generic-table/generic-table.component';
import { GenericInputComponent } from './components/generic-input/generic-input.component';
import { GenericButtonComponent } from './components/generic-button/generic-button.component';
import { GenericDropdownComponent } from './components/generic-dropdown/generic-dropdown.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ListItemFileComponent } from './components/list-item-file/list-item-file.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { SpecialCellComponent } from './components/special-cell/special-cell.component';
import { GenericGroupButtonsComponent } from './components/generic-group-buttons/generic-group-buttons.component';
/* Services */
import { SharedService } from './services/shared.service';
import { SplashScreenService } from './services/splash-screen.service';
/* Directives */
import { NgInitDirective } from 'src/app/shared/directives/ng-init.directive';
/* Pipes */
import { HarshifyPipe } from './pipes/harshify.pipe';
import { CuttingTextPipe } from './pipes/cutting-text.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SizeParserPipe } from './pipes/sizeparser.pipe';
import { TableTitleParserPipe } from './pipes/table-title-parser.pipe';
import { LogoShowComponent } from './components/logo-show/logo-show.component';

@NgModule({
  declarations: [
    /* Components */
    GenericTableComponent,
    GenericInputComponent,
    GenericButtonComponent,
    GenericDropdownComponent,
    FileUploaderComponent,
    ListItemFileComponent,
    CardListComponent,
    SpecialCellComponent,
    GenericGroupButtonsComponent,
    LogoShowComponent,
    /* Directives */
    NgInitDirective,
    /* Pipes */
    HarshifyPipe,
    CuttingTextPipe,
    SafeHtmlPipe,
    SizeParserPipe,
    TableTitleParserPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BootstrapModule,
    MaterialModule,
    QRCodeModule,
    NgxUploaderModule,
  ],
  providers: [SharedService, SplashScreenService],
  exports: [
    /* Components */
    GenericTableComponent,
    GenericInputComponent,
    GenericButtonComponent,
    GenericDropdownComponent,
    FileUploaderComponent,
    ListItemFileComponent,
    CardListComponent,
    SpecialCellComponent,
    GenericGroupButtonsComponent,
    LogoShowComponent,
    /* Modules */
    ReactiveFormsModule,
    FormsModule,
    BootstrapModule,
    MaterialModule,
    QRCodeModule,
    NgxUploaderModule,
    /* Directives */
    NgInitDirective,
    /* Pipes */
    HarshifyPipe,
    CuttingTextPipe,
    SafeHtmlPipe,
    SizeParserPipe,
    TableTitleParserPipe,
  ],
})
export class SharedModule {}
