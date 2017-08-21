import { ChampionDto } from './champion-dto';
import { StaticChampionDto } from './static-champion-dto';

export interface ChampionView extends ChampionDto {
  data: StaticChampionDto;
}
