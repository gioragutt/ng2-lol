import { Component, OnInit, Injectable, ViewChild, ElementRef } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { MdSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RiotApi } from '../lol-api';
import { ChampionDto, StaticChampionDto } from '../lol-api/dto';

export class PlatformChampionsDataSource extends DataSource<ChampionView> {
  private dataChange = new BehaviorSubject<ChampionView[]>([]);
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private riot: RiotApi, private _sort: MdSort) {
    super();

    this.riot.dataLoaded
      .do(loaded => console.log('Data loaded ', loaded))
      .filter(loaded => loaded === true)
      .subscribe(() => {
        const champions = this.riot.champions;
        const staticChampions = this.riot.staticChampions;
        if (!champions || !staticChampions) {
          console.log('Data not loaded!');
          this.dataChange.next([]);
        }
        console.log(`Platform, Static`, champions, staticChampions);
        const championsView = champions.map((value) => {
          return {
            ...value,
            data: staticChampions.data[staticChampions.keys[value.id]]
          };
        });
        console.log(`Champions view`, championsView);
        this.dataChange.next(championsView);
      });
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ChampionView[]> {
    const displayDataChanges = [
      this._filterChange,
      this._sort.mdSortChange,
      this.dataChange,
    ];

    console.log('Connect called!!!!');
    return Observable.merge(...displayDataChanges)
      .map(() => this.dataChange.value.slice().filter((item: ChampionView) => {
        const searchStr = (item.id + item.data.name + item.data.title).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      }))
      .map(data => this.sortData(data));
  }

  sortData(data: ChampionView[]): ChampionView[] {
    if (!this._sort.active || this._sort.direction === '') { return data; }

    console.log('Active sort is', this._sort.active);
    return data.sort((a, b) => {
      const selector = (champ: ChampionView) => {
        switch (this._sort.active) {
          case 'image': return champ.data.image.full;
          case 'id': return champ.id;
          case 'name': return champ.data.name;
          case 'title': return champ.data.title;
          case 'active': return champ.active;
          case 'freeToPlay': return champ.freeToPlay;
          case 'botEnabled': return champ.botEnabled;
          case 'botMmEnabled': return champ.botMmEnabled;
        }
      };

      const propertyA = selector(a);
      const propertyB = selector(b);

      if (typeof propertyA === 'boolean') {
        return (propertyA !== propertyB && (this._sort.direction === 'asc') === propertyB) ? 1 : -1;
      }

      if (typeof propertyA === 'string') {
        return (propertyA > propertyB ? 1 : -1) * (this._sort.direction === 'asc' ? 1 : -1);
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect() {}
}

@Component({
  selector: 'app-platform-champions-table',
  templateUrl: './platform-champions-table.component.html',
  styleUrls: ['./platform-champions-table.component.scss'],
})
export class PlatformChampionsTableComponent implements OnInit {
  displayedColumns = ['image', 'id', 'name', 'title', 'active', 'freeToPlay', 'botEnabled', 'botMmEnabled'];
  public dataSource: PlatformChampionsDataSource;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;

  constructor(private riot: RiotApi) { }

  public championImage(path: string): string {
    return this.riot.championImageUrl(path);
  }

  ngOnInit(): void {
    this.dataSource = new PlatformChampionsDataSource(this.riot, this.sort);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { console.log('!this.dataSource. Basa'); return; }
      const newFilterValue = this.filter.nativeElement.value;
      console.log(`New filter value`, newFilterValue);
      this.dataSource.filter = newFilterValue;
    });
  }
}

interface ChampionView extends ChampionDto {
  data: StaticChampionDto;
}
