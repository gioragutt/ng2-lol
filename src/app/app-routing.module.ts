import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  BasicChampionInfoComponent,
  ChampionInfoPageComponent,
  ChampionInfoPageLoaderComponent,
  PlatformChampionsTableComponent,
  ChampionSkinsComponent,
  ChampionStatsComponent,
  ChampionSpellsComponent
} from './lol-data';

const routes: Routes = [
  {
    path: 'champions',
    children: [
      { path: '', component: PlatformChampionsTableComponent },
      {
        path: ':id', component: ChampionInfoPageLoaderComponent,
        children: [
          { path: 'info', component: BasicChampionInfoComponent },
          { path: 'skins', component: ChampionSkinsComponent },
          { path: 'stats', component: ChampionStatsComponent },
          { path: 'spells', component: ChampionSpellsComponent },
          { path: '**', pathMatch: 'full', redirectTo: 'info' }
        ]
      },
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: '/champions' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
