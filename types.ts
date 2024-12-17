// Tipos para las propiedades básicas
export interface Ability {
    name: string;
    url: string;
}

export interface AbilitySlot {
    ability: Ability;
    is_hidden: boolean;
    slot: number;
}

export interface Cry {
    latest: string;
    legacy: string;
}

export interface Form {
    name: string;
    url: string;
}

export interface Version {
    name: string;
    url: string;
}

export interface GameIndex {
    game_index: number;
    version: Version;
}

export interface Move {
    name: string;
    url: string;
}

export interface MoveLearnMethod {
    name: string;
    url: string;
}

export interface MoveVersionDetail {
    version_group: Version;
    level_learned_at: number;
    move_learn_method: MoveLearnMethod;
}

export interface MoveSlot {
    move: Move;
    version_group_details: MoveVersionDetail[];
}

export interface PokemonSpecies {
    name: string;
    url: string;
}

export interface Sprite {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface Stat {
    name: string;
    url: string;
}

export interface StatSlot {
    base_stat: number;
    effort: number;
    stat: Stat;
}

export interface Type {
    name: string;
    url: string;
}

export interface TypeSlot {
    slot: number;
    type: Type;
}

// Tipo principal para el Pokémon
export interface Pokemon {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: AbilitySlot[];
    cries: Cry;
    forms: Form[];
    game_indices: GameIndex[];
    held_items: string[];
    location_area_encounters: string;
    moves: MoveSlot[];
    species: PokemonSpecies;
    sprites: Sprite;
    stats: StatSlot[];
    types: TypeSlot[];
}