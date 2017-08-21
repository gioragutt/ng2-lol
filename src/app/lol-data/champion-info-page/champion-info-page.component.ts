import { Component, OnInit, Input } from '@angular/core';
import { RiotApi } from '../../lol-api';
import { ChampionView } from '../../lol-api/dto';

interface NavLinks {
  path: any;
  label: string;
}

@Component({
  selector: 'app-champion-info-page',
  templateUrl: './champion-info-page.component.html',
  styleUrls: ['./champion-info-page.component.scss']
})
export class ChampionInfoPageComponent implements OnInit {
  @Input() champion: ChampionView;

  navLinks: NavLinks[] = [];

  constructor(private riot: RiotApi) { }

  public championImage(path: string): string {
    return this.riot.championImageUrl(path);
  }

  ngOnInit(): void {
    this.navLinks = [
      { path: ['./info'], label: 'Info' },
      { path: ['./stats'], label: 'Stats' },
      { path: ['./spells'], label: 'Spells' },
      { path: ['./skins'], label: 'Skins' }
    ];
  }

}
