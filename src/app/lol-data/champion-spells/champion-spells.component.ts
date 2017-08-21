import { Component, OnInit } from '@angular/core';
import { ChampionView } from '../../lol-api/dto/champion-view';
import { RiotApi } from '../../lol-api';
import { ActivatedRoute } from '@angular/router';
import { LoadChampionFromParams } from '../champion-info-page-loader/champion-info-page-loader.component';
import { ChampionSpellDto } from '../../lol-api/dto';

export interface SpellView extends ChampionSpellDto {
  imageUrl: string;
  processedTooltip: string;
}

@Component({
  selector: 'app-champion-spells',
  templateUrl: './champion-spells.component.html',
  styleUrls: ['./champion-spells.component.scss']
})
export class ChampionSpellsComponent implements OnInit {
  champion: ChampionView;
  spells: Array<SpellView> = [];

  constructor(private riot: RiotApi, private route: ActivatedRoute) { }

  private spellImageUrl(name: string) {
    return `http://ddragon.leagueoflegends.com/cdn/${this.riot.staticResourcesVersion}/img/spell/${name}`;
  }

  ngOnInit() {
    LoadChampionFromParams(this.riot, () => this.route.parent.paramMap)
      .subscribe((champ) => {
        this.champion = champ;
        this.spells = this.champion.data.spells.map<SpellView>(spell => ({
          ...spell,
          imageUrl: this.spellImageUrl(spell.image.full),
          processedTooltip: this.injectSpellVariables(spell.sanitizedTooltip, spell)
        }));
      });
  }

  private injectSpellVariables(template: string, spell: ChampionSpellDto): string {
    const variableLink = (link: string) => {
      switch (link) {
        case 'attackdamage': return 'AD';
        case 'spelldamage': return 'AP';
        case 'bonusattackdamage': return 'bonus AD';
        default: return link;
      }
    };

    const replaceVariable = (rawVariable: string) => {
      const variableName = rawVariable.substring(3, rawVariable.length - 3);
      if (variableName.startsWith('e')) {
        let effectIndex = parseInt(variableName.substring(1), 10);
        if (effectIndex === 0) {
          effectIndex = spell.effect.length - 1;
        }
        const effectArray = <number[]>spell.effect[effectIndex];
        if (effectArray.every(v => v === effectArray[0])) {
          return effectArray[0].toString();
        }
        return spell.effect[effectIndex].join(' / ');
      }

      if (!spell.vars) {
        return rawVariable;
      }

      const variableData = spell.vars.filter(v => v.key === variableName);
      if (variableData.length <= 0) {
        return rawVariable;
      }

      const details = variableData[0];
      return `${(Math.fround(details.coeff[0] * 100)) + '%'} ${variableLink(details.link)}`;
    };

    return template.replace(/\{\{\s\w+\s\}\}/g, (rawVariable: string) => {
      const fixedVariable = replaceVariable(rawVariable);
      return fixedVariable;
    });
  }
}
