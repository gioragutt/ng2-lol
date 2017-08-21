import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RiotApi } from '../../lol-api';
import { ChampionView } from '../../lol-api/dto';
import { Observable } from 'rxjs/Observable';

export const LoadChampionFromParams = (riot: RiotApi, toParams: () => Observable<ParamMap>): Observable<ChampionView> => {
    return riot.dataLoaded
      .filter(loaded => loaded === true)
      .switchMap(toParams)
      // .do(params => console.log(`Params`, params, params.keys))
      .map((params: ParamMap) => parseInt(params.get('id'), 10))
      // .do(id => console.log(`Id from route is ${id}`))
      .map(id => riot.championView(id));
};

export const LoadChampionFromRoute = (riot: RiotApi, route: ActivatedRoute): Observable<ChampionView> => {
  return LoadChampionFromParams(riot, () => route.paramMap);
};

@Component({
  selector: 'app-champion-info-page-loader',
  templateUrl: './champion-info-page-loader.component.html',
  styleUrls: ['./champion-info-page-loader.component.scss']
})
export class ChampionInfoPageLoaderComponent implements OnInit {
  champion: ChampionView | undefined = undefined;
  id: number;

  public get isLoading(): boolean {
    return typeof this.champion === 'undefined';
  }

  _isIdInvalid = false;
  public get isIdInvalid() {
    return this._isIdInvalid;
  }
  public set isIdInvalid(value: boolean) {
    this._isIdInvalid = value;
    // console.log(`Is id invalid ${value}`);
  }

  constructor(
    private route: ActivatedRoute,
    private riot: RiotApi
  ) { }

  ngOnInit() {
    LoadChampionFromRoute(this.riot, this.route)
      .subscribe(champ => {
        this.champion = champ;
        if (champ === null) {
          console.log('champ is null');
          this.isIdInvalid = true;
          return;
        }
        this.isIdInvalid = false;
      });
  }

}
