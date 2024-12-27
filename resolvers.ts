import GraphQLJSON from 'graphql-type-json';

//Solo dos personas sabian que hace este codigo Dios y yo que lo escribí, actualmente solo Dios sabe, pero funciona

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
            const moves = await Promise.all(
                pokemon.moves.map(async (move) => {
                    const moveData = await resolveURL(move.move.url);

                    // Incluimos los datos básicos del movimiento
                    return {
                        name: move.move.name,
                        moveData: {
                            accuracy: moveData.accuracy,
                            power: moveData.power,
                            pp: moveData.pp,
                            priority: moveData.priority,
                            type: moveData.type.name,
                            // Retornamos los aprendices limitados porque sino cada movimiento puede tener 500 pokemons que lo tienen
                            learnedByPokemon: (excludeId) => {
                                return getLimitedLearnedByPokemon(moveData.learned_by_pokemon, excludeId, 10);
                            },
                        },
                    };
                })
            );


            return moves;
        },

        async abilities(pokemon) {
            return Promise.all(
                pokemon.abilities.map(async (ability) => {
                    // Obtener la información completa de la habilidad
                    const abilityData = await resolveURL(ability.ability.url);

                    // Extraer los Pokémon que tienen esta habilidad
                    const pokemonWithAbility = abilityData.pokemon.map((poke) => poke.pokemon);

                    // Filtrar para excluir al propio Pokémon
                    const filteredPokemon = pokemonWithAbility.filter((poke) => poke.name !== pokemon.name);
                    const mapedPokemons = filteredPokemon.map((n)=>n.url)

                    const resolvedPokemons = await Promise.all(
                        mapedPokemons.map((url) => resolveURL(url))
                    );


                    const abilityEffects = abilityData.effect_entries[1]?.short_effect || "No description available";


                    return {
                        name: ability.ability.name,
                        is_hidden: ability.is_hidden,
                        slot: ability.slot,
                        effect: abilityEffects, // Descripción de la habilidad
                        pokemonHasIt: resolvedPokemons, // Pokémon que tienen la habilidad (sin incluir al propio Pokémon)
                    };
                })
            );
        },

        async stats(pokemon) {
            return pokemon.stats.map((stat) => ({
                base_stat: stat.base_stat,
                effort: stat.effort,
                name: stat.stat.name,
            }));
        },

        async types(pokemon) {
            return pokemon.types.map((type) => ({
                slot: type.slot,
                name: type.type.name,
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


    MoveData: {
        // Resolver optimizado para obtener los Pokémon aprendices limitados
        async learnedByPokemon(moveData, _, { excludeId }) {
            // Filtramos y limitamos los Pokémon aprendices de un movimiento
            const pokemonsQueAprenden = moveData.learnedByPokemon(excludeId);

            // Resolvemos las URLs para los Pokémon aprendices
            const resolvedPokemons = await Promise.all(
                pokemonsQueAprenden.map((url) => resolveURL(url))
            );

            return resolvedPokemons;
        },
    },
};

// Función auxiliar para filtrar, mezclar aleatoriamente y limitar las URLs de los Pokémon que aprenden un movimiento
function getLimitedLearnedByPokemon(learnedByPokemonURLs, excludeId, maxLimit) {
    // Filtramos para excluir el Pokémon actual y obtenemos solo las URLs
    const onlyUrl = learnedByPokemonURLs.map((n) => n.url);

    // Excluimos al Pokémon actual (usando excludeId)
    const filteredUrls = onlyUrl.filter((url) => !url.includes(excludeId));

    for (let i = filteredUrls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredUrls[i], filteredUrls[j]] = [filteredUrls[j], filteredUrls[i]]; // Intercambiamos elementos
    }

    // Limitamos los resultados al número máximo permitido
    const limitedUrls = filteredUrls.slice(0, maxLimit);

    return limitedUrls;
}


// Función auxiliar fuera de los resolutores para hacer el fetch
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