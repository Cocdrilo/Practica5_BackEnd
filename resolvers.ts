export const resolvers = {
    Query: {
        async pokemon(_: unknown, { name, id }: { name?: string; id?: number }, context: any) {
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
        async moves(pokemon:any) {
            const moves = await Promise.all(
                pokemon.moves.map(async (move:any) => {
                    const moveData = await resolveURL(move.move.url);

                    return {
                        name: move.move.name,
                        moveData: {
                            accuracy: moveData.accuracy,
                            power: moveData.power,
                            pp: moveData.pp,
                            priority: moveData.priority,
                            type: moveData.type.name,
                            learnedByPokemon: (excludeId:number) => {
                                return getLimitedLearnedByPokemon(moveData.learned_by_pokemon, excludeId, 10);
                            },
                        },
                    };
                })
            );


            return moves;
        },

        async abilities(pokemon:any) {
            return Promise.all(
                pokemon.abilities.map(async (ability:any) => {
                    const abilityData = await resolveURL(ability.ability.url);

                    const pokemonWithAbility = abilityData.pokemon.map((poke:any) => poke.pokemon);

                    const filteredPokemon = pokemonWithAbility.filter((poke:any) => poke.name !== pokemon.name);
                    const mapedPokemons = filteredPokemon.map((n:any)=>n.url)

                    const resolvedPokemons = await Promise.all(
                        mapedPokemons.map((url:string) => resolveURL(url))
                    );


                    const abilityEffects = abilityData.effect_entries[1]?.short_effect || "No description available";


                    return {
                        name: ability.ability.name,
                        is_hidden: ability.is_hidden,
                        slot: ability.slot,
                        effect: abilityEffects, 
                        pokemonHasIt: resolvedPokemons,
                    };
                })
            );
        },

        async stats(pokemon:any) {
            return pokemon.stats.map((stat:any) => ({
                base_stat: stat.base_stat,
                effort: stat.effort,
                name: stat.stat.name,
            }));
        },

        async types(pokemon:any) {
            return pokemon.types.map((type:any) => ({
                slot: type.slot,
                name: type.type.name,
            }));
        },

        async sprites(pokemon:any) {
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

        async cry(pokemon:any) {
            return pokemon.id
                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/cries/${pokemon.id}.ogg`
                : null;
        },

        async latest(pokemon:any) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/latest/${pokemon.id}.ogg`;
        },

        async legacy(pokemon:any) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/legacy/${pokemon.id}.ogg`;
        },

        async location_area_encounters(pokemon:any) {
            return pokemon.location_area_encounters;
        },

        async base_experience(pokemon:any) {
            return pokemon.base_experience;
        },

        async height(pokemon:any) {
            return pokemon.height;
        },

        async weight(pokemon:any) {
            return pokemon.weight;
        },
    },


    MoveData: {
        async learnedByPokemon(moveData:any, _:unknown, { excludeId }: { excludeId: number }) {
            const pokemonsQueAprenden = moveData.learnedByPokemon(excludeId);

            const resolvedPokemons = await Promise.all(
                pokemonsQueAprenden.map((url:string) => resolveURL(url))
            );

            return resolvedPokemons;
        },
    },
};

function getLimitedLearnedByPokemon(learnedByPokemonURLs: string[], excludeId: number, maxLimit: number) {
    const onlyUrl = learnedByPokemonURLs.map((n) => n.url);

    const filteredUrls = onlyUrl.filter((url) => !url.includes(excludeId));

    for (let i = filteredUrls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredUrls[i], filteredUrls[j]] = [filteredUrls[j], filteredUrls[i]]; 
    }

    const limitedUrls = filteredUrls.slice(0, maxLimit);

    return limitedUrls;
}


async function resolveURL(url: string) {
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