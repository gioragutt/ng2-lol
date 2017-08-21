import { Pipe, PipeTransform } from '@angular/core';

const mapping: Map<string, string> = new Map([
    ['armor', 'armor'],
    ['armorperlevel', 'armor per level'],
    ['attackdamage', 'attack damage'],
    ['attackdamageperlevel', 'attack damage per level'],
    ['attackrange', 'attack range'],
    ['attackspeedoffset', 'attack speed offset'],
    ['attackspeedperlevel', 'attack speed per level'],
    ['crit', 'crit'],
    ['critperlevel', 'crit per level'],
    ['hp', 'hp'],
    ['hpperlevel', 'hp per level'],
    ['hpregen', 'hp regeneration'],
    ['hpregenperlevel', 'hp regeneration per level'],
    ['movespeed', 'move speed'],
    ['mp', 'mana'],
    ['mpperlevel', 'mana per level'],
    ['mpregen', 'mana regen'],
    ['mpregenperlevel', 'mana regen per level'],
    ['spellblock', 'mr'],
    ['spellblockperlevel', 'mr per level']
]);

@Pipe({
  name: 'prettifyChampionStat'
})
export class PrettifyChampionStatPipe implements PipeTransform {

  transform(statName: string, resource: string): any {
    if (!mapping.has(statName)) {
      return statName;
    }

    return mapping.get(statName).replace('mana', resource);
  }

}
