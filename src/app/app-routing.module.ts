import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlatformChampionsTableComponent } from './platform-champions-table/platform-champions-table.component';
import { ChampionInfoPageComponent } from './champion-info-page/champion-info-page.component';

const routes: Routes = [
  {
    path: 'champ',
    children: [
      { path: '', component: PlatformChampionsTableComponent },
      { path: ':id', component: ChampionInfoPageComponent },
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: '/champ' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
