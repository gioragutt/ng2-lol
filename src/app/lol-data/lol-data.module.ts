import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { PlatformChampionsTableComponent } from './platform-champions-table/platform-champions-table.component';
import { ChampionInfoPageComponent } from './champion-info-page/champion-info-page.component';
import { ChampionInfoPageLoaderComponent } from './champion-info-page-loader/champion-info-page-loader.component';
import { BasicChampionInfoComponent } from './/basic-champion-info/basic-champion-info.component';
import { ChampionSkinsComponent } from './champion-skins/champion-skins.component';
import { ChampionTagsComponent } from './champion-tags/champion-tags.component';
import { IterateChampionInfoPipe } from './iterate-champion-info.pipe';
import { PrettifyChampionStatPipe } from './prettify-champion-stat.pipe';
import { ChampionStatsComponent } from './champion-stats/champion-stats.component';
import { ChampionSpellsComponent } from './champion-spells/champion-spells.component';
import { SpaceOutBurnoutPipe } from './space-out-burnout.pipe';

export {
  PlatformChampionsTableComponent,
  ChampionInfoPageComponent,
  ChampionInfoPageLoaderComponent,
  BasicChampionInfoComponent,
  ChampionSkinsComponent,
  ChampionStatsComponent,
  ChampionSpellsComponent
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    PlatformChampionsTableComponent,
    ChampionInfoPageComponent,
    ChampionInfoPageLoaderComponent,
    BasicChampionInfoComponent,
    ChampionSkinsComponent,
    ChampionTagsComponent,
    IterateChampionInfoPipe,
    PrettifyChampionStatPipe,
    ChampionStatsComponent,
    ChampionSpellsComponent,
    SpaceOutBurnoutPipe,
  ]
})
export class LolDataModule { }
