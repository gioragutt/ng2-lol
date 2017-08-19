import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LolApiModule } from './lol-api';
import { SharedModule } from './shared';
import { PlatformChampionsTableComponent } from './platform-champions-table/platform-champions-table.component';
import { ChampionInfoPageComponent } from './champion-info-page/champion-info-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PlatformChampionsTableComponent,
    ChampionInfoPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LolApiModule.forRoot(),
    SharedModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
