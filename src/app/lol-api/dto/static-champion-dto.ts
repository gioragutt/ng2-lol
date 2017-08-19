export interface StaticChampionListDto {
    keys: Map<string, string>;
    data: Map<string, StaticChampionDto>;
    version: string;
    type: string;
    format: string;
}

export interface StaticChampionDto {
    info: InfoDto;
    enemytips: Array<string>;
    stats: StatsDto;
    name: string;
    title: string;
    image: ImageDto;
    tags: Array<string>;
    partype: string;
    skins: Array<SkinDto>;
    passive: PassiveDto;
    recommended: Array<RecommendedDto>;
    allytips: Array<string>;
    key: string;
    lore: string;
    id: number;
    blurb: string;
    spells: Array<ChampionSpellDto>;
}

export interface InfoDto {
    difficulty: number;
    attack: number;
    defense: number;
    magic: number;
}

export interface StatsDto {
    armorperlevel: number;
    hpperlevel: number;
    attackdamage: number;
    mpperlevel: number;
    attackspeedoffset: number;
    armor: number;
    hp: number;
    hpregenperlevel: number;
    spellblock: number;
    attackrange: number;
    movespeed: number;
    attackdamageperlevel: number;
    mpregenperlevel: number;
    mp: number;
    spellblockperlevel: number;
    crit: number;
    mpregen: number;
    attackspeedperlevel: number;
    hpregen: number;
    critperlevel: number;
}

export interface SkinDto {
    num: number;
    name: string;
    id: number;
}

export interface PassiveDto {
    image: ImageDto;
    sanitizedDescription: string;
    name: string;
    description: string;
}

export interface RecommendedDto {
    map: string;
    blocks: Array<BlockDto>;
    champion: string;
    title: string;
    priority: boolean;
    mode: string;
    type: string;
}

export interface BlockDto {
    items: Array<BlockItemDto>;
    recMath: boolean;
    type: string;
}

export interface BlockItemDto {
    count:  number;
    id: number;
}

export interface ImageDto {
    full: string;
    group: string;
    sprite: string;
    h: number;
    w: number;
    y: number;
    x: number;
}

export interface ChampionSpellDto {
    cooldownBurn: string;
    resource: string;
    leveltip: LevelTipDto;
    vars: Array<SpellVarsDto>;
    costType: string;
    image: ImageDto;
    sanitizedDescription: string;
    sanitizedTooltip: string;
    effect: Array<Array<number>>;
    tooltip: string;
    maxrank:  number;
    costBurn: string;
    rangeBurn: string;
    range: Array<number> | 'self';
    cooldown: Array<number>;
    cost: Array<number>;
    key: string;
    description: string;
    effectBurn: Array<string>;
    altimages: Array<ImageDto>;
    name: string;
}

export interface LevelTipDto {
    effect: Array<string>;
    label: Array<string>;
}

export interface SpellVarsDto {
    ranksWith: string;
    dyn: string;
    link: string;
    coeff: Array<number>;
    key: string;
}
