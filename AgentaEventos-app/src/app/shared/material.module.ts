import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  exports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class MaterialModule {}
