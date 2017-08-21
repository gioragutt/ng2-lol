// tslint:disable:max-line-length
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChampionListDto, StaticChampionListDto, ChampionView } from './dto';
import { Http, URLSearchParams } from '@angular/http';

import { duration, FromTo } from 'moment';

import { LocalStorageService } from '../shared';

const FixCors = (path) => `https://cors-anywhere.herokuapp.com/${path}`;
// const FixCors = (path) => path;
const API_KEY = `RGAPI-d6840698-71d4-43fa-898e-25066fadafc1`;
const PlatformApi = (path) => FixCors(`https://eun1.api.riotgames.com/lol/platform/v3/${path}`);
const StaticDataApi = (path) => FixCors(`https://eun1.api.riotgames.com/lol/static-data/v3/${path}`);


@Injectable()
export class RiotApi {
  static CACHE_VERSION_TOKEN = '[LolApiCache] version';
  static CACHE_LAST_UPDATE_TIME_TOKEN = '[LolApiCache] last update time';
  static CACHE_STATIC_CHAMPIONS_TOKEN = '[LolApiCache] static champions';
  static CACHE_PLATFORM_CHAMPIONS_TOKEN = '[LolApiCache] platform champions';

  private _staticChampions: StaticChampionListDto | undefined = undefined;
  private _platformChampions: ChampionListDto | undefined  = undefined;
  private _dataLoaded = new BehaviorSubject<boolean>(false);
  private _version: string | undefined = undefined;

  public get staticResourcesVersion(): string {
    return this.storage.retrieve<string>(RiotApi.CACHE_VERSION_TOKEN);
  }

  private set staticVersion(version: string) {
    this._version = version;
    console.log(`<Static Version> set to ${this._version}`);
  }

  private get staticVersion() {
    return this._version;
  }

  constructor(private http: Http, private storage: LocalStorageService) {
    this.loadData().subscribe(() => console.log('Done loading data'));
  }

  get staticChampions(): StaticChampionListDto {
    return this._staticChampions;
  }

  get champions(): ChampionListDto {
    return this._platformChampions;
  }

  get dataLoaded(): Observable<boolean> {
    return this._dataLoaded.asObservable();
  }

  public championImageUrl(path: string) {
    // return `http://ddragon.leagueoflegends.com/cdn/${this.staticVersion}/img/champion/${path}`;
    return `./assets/mock/images/${path}`;
  }

  public championView(id: number): ChampionView | null {
    if (!this.champions || !this.staticChampions) {
      return null;
    }

    const platformData = this.champions.filter(champion => champion.id === id);
    if (platformData.length === 0) {
      return null;
    }

    return {
      ...platformData[0],
      data: this.staticChampions.data[this.staticChampions.keys[id]]
    };
  }

  private loadData(): Observable<any> {
    return Observable.defer(() => {
      this._dataLoaded.next(false);

      return Observable.forkJoin(
        this.loadStaticData(),
        this.loadPlaformData()
      ).do(() => {
        const cachedVersion = this.storage.retrieve<string>(RiotApi.CACHE_VERSION_TOKEN);
        if (cachedVersion && cachedVersion === this.staticVersion) {
          console.log(`Current version ${this.staticVersion} is defined and is equal to the last cached version, not caching anything new`);
        }
        this.updateLastUpdateTime();
        this._dataLoaded.next(true);
      });
    });
  }

  // ================
  //     PLATFORM
  // ================

  private loadPlaformData(): Observable<any> {
    return this.loadPlatformChampions();
  }

  private loadPlatformChampions(): Observable<ChampionListDto> | ErrorObservable {
    const upToDateCache = this.checkForUpToDateCachedPlatformChampions();
    if (upToDateCache) {
      return Observable.of(upToDateCache);
    }

    return this.tryLoadPlatformChampionsFromApi();
  }

  private checkForUpToDateCachedPlatformChampions(): ChampionListDto | undefined {
    const maxHoursSinceLastUpdate = 1;
    const hoursSinceLastUpdate = this.hoursSinceLastUpdate();
    if (hoursSinceLastUpdate <= 0 || hoursSinceLastUpdate > maxHoursSinceLastUpdate) {
      return undefined;
    }
    const cache = this.loadPlatformChampionsFromCache();
    if (!cache) {
      return undefined;
    }

    console.log(`It's been less than ${maxHoursSinceLastUpdate} hours, loading platform champion data from cache`);
    return cache;
  }

  private tryLoadPlatformChampionsFromApi(): Observable<ChampionListDto> | ErrorObservable {
    const params = new URLSearchParams();
    params.append('api_key', API_KEY);
    params.append('freeToPlay', 'false');
    // return this.http.get(PlatformApi('champions'), {params})
    return this.http.get('./assets/mock/platformChampions.json')
      .map(res => res.json())
      .do(data => console.log('API ', data))
      .map(res => <ChampionListDto>res.champions)
      .do(champions => {
        console.log('Loading Platform Champion Data from API');
        this.updatePlatformChampions(champions);
      })
      .catch(err => {
        const cache = this.loadPlatformChampionsFromCache();
        if (cache) {
          return Observable.of(cache);
        }
        console.log('No cache for platform champions on error, sucks for you');
        return Observable.throw(err);
      });
  }

  // ===============
  //     VERSION
  // ===============

  private loadVersion(): Observable<[boolean, string]> {
    const upToDateVersion = this.checkForUpToDateCachedVersion();
    if (upToDateVersion !== undefined) {
      return Observable.of(upToDateVersion);
    }

    return this.tryLoadVersionFromApi();
  }

  private checkForUpToDateCachedVersion(): [boolean, string] | undefined {
    const maxHoursSinceLastUpdate = 24;
    const hoursSinceLastUpdate = this.hoursSinceLastUpdate();
    if (hoursSinceLastUpdate <= 0 || hoursSinceLastUpdate > maxHoursSinceLastUpdate) {
      return undefined;
    }

    const cache = this.storage.retrieve<string>(RiotApi.CACHE_VERSION_TOKEN);
    if (!cache) {
      return undefined;
    }

    console.log(`It's been less than ${maxHoursSinceLastUpdate} hours, loading version from cache`);
    return [true, cache];
  }

  private tryLoadVersionFromApi(): Observable<[boolean, string]> {
    const url = StaticDataApi(`versions?api_key=${API_KEY}`);
    console.log('Loading Static Data Api Version');
    // return this.http.get(url)
    return this.http.get('./assets/mock/versions.json')
      .map(res => res.json()[0])
      .do(version => this.updateVersion(version))
      .map(version => [false, version])
      .catch(() => {
        const cachedVersion = this.storage.retrieve<string>(RiotApi.CACHE_VERSION_TOKEN);
        this.staticVersion = cachedVersion;
        console.log(`Loaded version ${this.staticVersion} from cache`);
        return Observable.of([true, cachedVersion]);
      });
  }

  // ===============
  //     STATIC
  // ===============
  private loadStaticData(): Observable<any> {
    return this.loadVersion()
      .switchMap(([fromCache, version]) => this.tryLoadStaticChampionFromCache(version, fromCache))
      .switchMap(successful => successful ? Observable.of(null) : this.loadStaticChampionsFromApi());
  }

  private hoursSinceLastUpdate(): number {
    const lastUpdateTime = this.storage.retrieve<number>(RiotApi.CACHE_LAST_UPDATE_TIME_TOKEN);
    if (!lastUpdateTime) {
      return -1;
    }

    const fromTo: FromTo = {
      from: lastUpdateTime,
      to: Date.now()
    };
    return duration(fromTo).asHours();
  }

  private tryLoadStaticChampionFromCache(latestVersion: string, versionFromCache: boolean): Observable<boolean> {
    if (!versionFromCache || !latestVersion) {
      console.log('No cache for static champion data, retrieving from API');
      return Observable.of(false);
    }
    this._staticChampions = this.storage.retrieve<StaticChampionListDto>(RiotApi.CACHE_STATIC_CHAMPIONS_TOKEN);
    console.log('Version still', latestVersion, 'loaded static champions from cache', this._staticChampions);
    return Observable.of(true);
  }

  private loadStaticChampionsFromApi(): Observable<StaticChampionListDto> {
    const params = new URLSearchParams();
    params.append('api_key', API_KEY);
    params.append('version', this.staticVersion);
    params.append('locale', 'en_US');
    params.append('tags', 'all');
    params.append('dataById', 'false');

    // return this.http.get(StaticDataApi(`champions`), {params})
    return this.http.get('./assets/mock/staticChampions.json')
      .map(res => <StaticChampionListDto>res.json())
      .do(data => {
        console.log('Loaded Static Champion Data from API');
        this.updateStaticChampions(data);
      })
      .catch(err => {
        return Observable.of(undefined);
      });
  }

  private updateVersion(data: string) {
    this.staticVersion = data;
    console.log(`Caching version ${this.staticVersion}`);
    this.storage.store(RiotApi.CACHE_VERSION_TOKEN, this.staticVersion);
  }

  private loadPlatformChampionsFromCache(): ChampionListDto | undefined {
    const cache = this.storage.retrieve<ChampionListDto>(RiotApi.CACHE_PLATFORM_CHAMPIONS_TOKEN);
    if (!cache) {
      return undefined;
    }

    console.log('Loading Platform Champion Data from Cache', cache);
    this._platformChampions = cache;
    return cache;
  }

  private updatePlatformChampions(champions: ChampionListDto) {
    this._platformChampions = champions;
    console.log('Cached platform champions data', this._platformChampions);
    this.storage.store(RiotApi.CACHE_PLATFORM_CHAMPIONS_TOKEN, this._platformChampions);
  }

  private updateStaticChampions(data: StaticChampionListDto) {
    this._staticChampions = data;
    console.log(`Caching static champion data`, this._staticChampions);
    this.storage.store(RiotApi.CACHE_STATIC_CHAMPIONS_TOKEN, this._staticChampions);
  }

  private updateLastUpdateTime() {
    const lastUpdateTime = Date.now();
    console.log(`Caching new last update time ${lastUpdateTime}`);
    this.storage.store(RiotApi.CACHE_LAST_UPDATE_TIME_TOKEN, lastUpdateTime);
  }
}
