import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './local-storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CdkTableModule,
} from '@angular/cdk';
import {
  MdTableModule,
  MdInputModule,
  MdSortModule,
} from '@angular/material';

export {
  LocalStorageService,
};

const MATERIAL_MODULES = [
  CdkTableModule,
  MdTableModule,
  MdInputModule,
  MdSortModule,
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ...MATERIAL_MODULES
  ],
  exports: MATERIAL_MODULES
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [LocalStorageService]
    };
  }
}
