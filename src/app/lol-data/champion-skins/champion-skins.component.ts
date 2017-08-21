import { Component, OnInit } from '@angular/core';
import { RiotApi } from '../../lol-api';
import { ActivatedRoute } from '@angular/router';
import { LoadChampionFromParams } from '../champion-info-page-loader/champion-info-page-loader.component';

interface SkinData {
  num: number;
  name: string;
  url: string;
}

@Component({
  selector: 'app-champion-skins',
  templateUrl: './champion-skins.component.html',
  styleUrls: ['./champion-skins.component.scss']
})
export class ChampionSkinsComponent implements OnInit {

  skins: SkinData[] = [];

  constructor(private riot: RiotApi, private route: ActivatedRoute) { }

  public championSplash(name: string, num: number) {
    return `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${name}_${num}.jpg`;
  }

  titleForSkin(skin: SkinData) {
    return `${skin.num + 1}. ${skin.name}`;
  }

  ngOnInit() {
    LoadChampionFromParams(this.riot, () => this.route.parent.paramMap)
      .subscribe((champ) => {
        if (!champ) {
          console.log('Invalid champion in skins');
          return;
        }
        this.skins = champ.data.skins.map(({num, name}) =>
        ({
          num,
          name,
          url: this.championSplash(champ.data.name, num)}));
      });
  }
}
