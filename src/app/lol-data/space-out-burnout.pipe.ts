import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceOutBurnout'
})
export class SpaceOutBurnoutPipe implements PipeTransform {

  transform(burnout: string, args?: any): any {
    return burnout.split('/').join(' / ');
  }

}
