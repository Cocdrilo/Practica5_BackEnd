
export const schema = `#graphql

type Pokemon {
    id: ID!
    name: String!
    abilities: [Ability]
    moves: [Move]
}

type Ability {
    name: String!
    effect: String
}

type Move {
    name: String!
    power: Int
}


type Query {
    pokemon(id : ID!) : Pokemon
}


`