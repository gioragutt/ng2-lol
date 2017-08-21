import { Component, OnInit } from '@angular/core';
import { ChampionView } from '../../lol-api/dto/champion-view';
import { RiotApi } from '../../lol-api';
import { ActivatedRoute } from '@angular/router';
import { LoadChampionFromParams } from '../champion-info-page-loader/champion-info-page-loader.component';

@Component({
  selector: 'app-champion-stats',
  templateUrl: './champion-stats.component.html',
  styleUrls: ['./champion-stats.component.scss']
})
export class ChampionStatsComponent implements OnInit {
  champion: ChampionView;

  constructor(private riot: RiotApi, private route: ActivatedRoute) { }

  ngOnInit() {
    LoadChampionFromParams(this.riot, () => this.route.parent.paramMap)
      .subscribe((champ) => this.champion = champ);
  }
}
