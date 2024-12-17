
export type Pokemon = {
    id : string
    name : string
    abilities : Ability
    Moves : Move
}

export type Ability = {
    name : string
    effect : string
}

export type Move = {
    name : string
    power : number
}