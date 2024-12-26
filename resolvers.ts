import GraphQLJSON from 'graphql-type-json';
export const resolvers = {
    Query: {
        async pokemon(_: unknown, { name, id }) {
            let url = `https://pokeapi.co/api/v2/pokemon/`;

            if (name) {
                url += name.toLowerCase();
            } else if (id) {
                url += id;
            } else {
                throw new Error('Se debe proporcionar un nombre o ID');
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Error al obtener datos de Pokémon');
                }
                const data = await response.json();
                return data;
            } catch (error) {
                throw new Error('Error al obtener datos de Pokémon');
            }
        },
    },


    Pokemon: {
        async moves(pokemon) {
            const moves = await Promise.all(pokemon.moves.map(async (move) => {
                const moveData = await resolveURL(move.move.url); // Usando la función auxiliar
                const pokemonsQueAprenden = moveData.learned_by_pokemon.map((n)=>n.url)
                console.log(move.move.name)
                console.log(pokemonsQueAprenden)
                const pokemons = await pokemonsQueAprenden.map(async (n)=>await resolveURL(n))
                const datos = {
                    accuracy : moveData.accuracy,
                    power: moveData.power,
                    pp : moveData.pp,
                    priority: moveData.priority,
                    type : moveData.type.name,
                    learnedByPokemon : pokemons
                }
                return {
                    name: move.move.name,
                    moveData : datos
                };
            }));
            return moves;
        },

        async stats(pokemon) {
            return pokemon.stats.map(async (stat) => ({
                base_stat: stat.base_stat,
                effort: stat.effort,
                name : stat.stat.name
            }));
        },

        async types(pokemon) {
            return pokemon.types.map(async (type) => ({
                slot: type.slot,
                name : type.type.name
            }));
        },

        async sprites(pokemon) {
            return {
                front_default: pokemon.sprites.front_default,
                back_default: pokemon.sprites.back_default,
                front_shiny: pokemon.sprites.front_shiny,
                back_shiny: pokemon.sprites.back_shiny,
                other: {
                    dream_world: {
                        front_default: pokemon.sprites.other.dream_world.front_default,
                        front_female: pokemon.sprites.other.dream_world.front_female,
                    },
                    home: {
                        front_default: pokemon.sprites.other.home.front_default,
                        front_female: pokemon.sprites.other.home.front_female,
                        front_shiny: pokemon.sprites.other.home.front_shiny,
                        front_shiny_female: pokemon.sprites.other.home.front_shiny_female,
                    },
                    official_artwork: {
                        front_default: pokemon.sprites.other['official-artwork'].front_default,
                        front_shiny: pokemon.sprites.other['official-artwork'].front_shiny,
                    },
                    showdown: {
                        back_default: pokemon.sprites.other.showdown.back_default,
                        back_female: pokemon.sprites.other.showdown.back_female,
                        back_shiny: pokemon.sprites.other.showdown.back_shiny,
                        back_shiny_female: pokemon.sprites.other.showdown.back_shiny_female,
                        front_default: pokemon.sprites.other.showdown.front_default,
                        front_female: pokemon.sprites.other.showdown.front_female,
                        front_shiny: pokemon.sprites.other.showdown.front_shiny,
                        front_shiny_female: pokemon.sprites.other.showdown.front_shiny_female,
                    },
                },
            };
        },


        async cry(pokemon) {
            return pokemon.id
                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/cries/${pokemon.id}.ogg`
                : null;
        },

        async latest(pokemon) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/latest/${pokemon.id}.ogg`;
        },

        async legacy(pokemon) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/legacy/${pokemon.id}.ogg`;
        },

        async location_area_encounters(pokemon) {
            return pokemon.location_area_encounters;
        },

        async base_experience(pokemon) {
            return pokemon.base_experience;
        },

        async height(pokemon) {
            return pokemon.height;
        },

        async weight(pokemon) {
            return pokemon.weight;
        },
    },
};

// Función auxiliar fuera de los resolutores
async function resolveURL(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener datos desde la URL: ${url}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Error al hacer fetch en la URL: ${url}`);
    }
}

export default resolvers;
