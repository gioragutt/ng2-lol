import { Pipe, PipeTransform } from '@angular/core';
import { InfoDto } from '../lol-api/dto/static-champion-dto';

export interface InfoValue {
  name: string;
  value: number;
}

@Pipe({
  name: 'iterateChampionInfo'
})
export class IterateChampionInfoPipe implements PipeTransform {

  transform(info: InfoDto, args?: any): Array<InfoValue> {
    return Object.entries(info).map(([name, value]) => ({name, value}));
  }

}
