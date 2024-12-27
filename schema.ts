
export const schema = `#graphql
type Query {
    pokemon(name: String, id: Int): Pokemon
}

scalar JSON

type Pokemon {
    id: Int
    name: String
    height: Int
    weight: Int
    base_experience: Int
    cry: String
    latest: String
    legacy: String
    location_area_encounters: String
    moves: [Move]
    stats: [Stat]
    types: [Type]
    abilities: [Ability]
    sprites: Sprites
}

type Ability {
    name : String
    effect : String
    is_hidden : Boolean
    slot : Int
    pokemonHasIt : [Pokemon]
}

type Move {
    name: String
    moveData: MoveData
}

type MoveData {
    accuracy : Int
    power : Int
    pp : Int
    priority : Int
    type : String
    learnedByPokemon : [Pokemon]
}

type Stat {
    base_stat: Int
    effort: Int
    name: String
}

type Type {
    slot: Int
    name: String
}


type Sprites {
    front_default: String
    back_default: String
    front_shiny: String
    back_shiny: String
    other: OtherSprites
}

type OtherSprites {
    dream_world: DreamWorld
    home: HomeSprites
    official_artwork: OfficialArtwork
    showdown: ShowdownSprites
}

type DreamWorld {
    front_default: String
    front_female: String
}

type HomeSprites {
    front_default: String
    front_female: String
    front_shiny: String
    front_shiny_female: String
}

type OfficialArtwork {
    front_default: String
    front_shiny: String
}

type ShowdownSprites {
    back_default: String
    back_female: String
    back_shiny: String
    back_shiny_female: String
    front_default: String
    front_female: String
    front_shiny: String
    front_shiny_female: String
}
`;