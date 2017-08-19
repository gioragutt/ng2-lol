import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { RiotApi } from './riot-api.service';

export {
  RiotApi
};

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    // HttpClientModule,
  ],
  declarations: []
})
export class LolApiModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LolApiModule,
      providers: [RiotApi]
    };
  }
}
