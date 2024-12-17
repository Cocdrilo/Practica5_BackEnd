
export const schema = `#graphql
type Ability {
    name: String!
    url: String!
}

type AbilitySlot {
    ability: Ability!
    is_hidden: Boolean!
    slot: Int!
}

type Cry {
    latest: String!
    legacy: String!
}

type Form {
    name: String!
    url: String!
}

type GameIndex {
    game_index: Int!
    version: Version!
}

type Version {
    name: String!
    url: String!
}

type Move {
    name: String!
    url: String!
}

type MoveVersionDetail {
    version_group: Version!
    level_learned_at: Int!
    move_learn_method: MoveLearnMethod!
}

type MoveLearnMethod {
    name: String!
    url: String!
}

type MoveSlot {
    move: Move!
    version_group_details: [MoveVersionDetail!]!
}

type PokemonSpecies {
    name: String!
    url: String!
}

type Sprite {
    back_default: String
    back_female: String
    back_shiny: String
    back_shiny_female: String
    front_default: String
    front_female: String
    front_shiny: String
    front_shiny_female: String
}

type Stat {
    name: String!
    url: String!
}

type StatSlot {
    base_stat: Int!
    effort: Int!
    stat: Stat!
}

type Type {
    name: String!
    url: String!
}

type TypeSlot {
    slot: Int!
    type: Type!
}

type Pokemon {
    id: Int!
    name: String!
    base_experience: Int!
    height: Int!
    is_default: Boolean!
    order: Int!
    weight: Int!
    abilities: [AbilitySlot!]!
    cries: Cry!
    forms: [Form!]!
    game_indices: [GameIndex!]!
    held_items: [String!]!
    location_area_encounters: String!
    moves: [MoveSlot!]!
    species: PokemonSpecies!
    sprites: Sprite!
    stats: [StatSlot!]!
    types: [TypeSlot!]!
}

type Query {
    getPokemon(id: Int,name:String): Pokemon
}
`