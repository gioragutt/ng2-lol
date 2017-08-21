import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CdkTableModule,
} from '@angular/cdk';
import {
  MdTableModule,
  MdInputModule,
  MdSortModule,
  MdButtonModule,
  MdToolbarModule,
  MdIconModule,
  MdCardModule,
  MdTabsModule,
  MdChipsModule,
  MdListModule,
  MdProgressBarModule,
  MdTooltipModule,
} from '@angular/material';

export {
  LocalStorageService,
};

const MATERIAL_MODULES = [
  CdkTableModule,
  MdTableModule,
  MdInputModule,
  MdSortModule,
  MdButtonModule,
  MdToolbarModule,
  MdIconModule,
  MdCardModule,
  MdTabsModule,
  MdChipsModule,
  MdListModule,
  MdProgressBarModule,
  MdTooltipModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    ...MATERIAL_MODULES
  ],
  exports: [
    RouterModule,
    ...MATERIAL_MODULES
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [LocalStorageService]
    };
  }
}
