export interface ChampionDto {
    id: number;
    freeToPlay: boolean;
    active: boolean;
    botEnabled: boolean;
    botMmEnabled: boolean;
}

export type ChampionListDto = Array<ChampionDto>;

