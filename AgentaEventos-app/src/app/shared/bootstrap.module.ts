import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* NGX-Bootstrap */
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';

/* NGX-Bootstrap-Expanded-Features */
import { NgxBootstrapExpandedFeaturesService } from 'ngx-bootstrap-expanded-features';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [NgxBootstrapExpandedFeaturesService, BsDatepickerConfig],
  exports: [ModalModule, BsDropdownModule, BsDatepickerModule],
})
export class BootstrapModule {}
