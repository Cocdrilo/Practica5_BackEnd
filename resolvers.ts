// Resolvers
export const resolvers = {
    Query: {
      async pokemon(_: any, { name, id }: { name?: string; id?: number }, context: any) {
        if (context.depth > 5) {
          throw new Error("Maximum recursion depth exceeded");
        }
  
        const identifier = name || id;
        if (!identifier) {
          throw new Error("You must provide a Pokémon name or ID.");
        }
  
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        if (!response.ok) {
          throw new Error(`Error fetching Pokémon: ${response.statusText}`);
        }
  
        const pokemonData = await response.json();
  
        return {
          ...pokemonData,
          moves: pokemonData.moves.map((move: any) => ({
            name: move.move.name,
            moveData: null, // Inicialmente null para evitar recursión inmediata
          })),
          abilities: pokemonData.abilities.map((ability: any) => ({
            name: ability.ability.name,
            is_hidden: ability.is_hidden,
            slot: ability.slot,
          })),
          stats: pokemonData.stats.map((stat: any) => ({
            base_stat: stat.base_stat,
            effort: stat.effort,
            name: stat.stat.name,
          })),
          types: pokemonData.types.map((type: any) => ({
            slot: type.slot,
            name: type.type.name,
          })),
          sprites: pokemonData.sprites,
        };
      },
    },
  
    Move: {
      async moveData(parent: any, _: any, context: any) {
        if (context.depth > 5) {
          return null; // Detener la recursión en niveles profundos
        }
  
        context.depth += 1; // Incrementar la profundidad
  
        const response = await fetch(`https://pokeapi.co/api/v2/move/${parent.name}`);
        if (!response.ok) {
          throw new Error(`Error fetching move data: ${response.statusText}`);
        }
  
        const moveData = await response.json();
  
        context.depth -= 1; // Restaurar la profundidad al salir
  
        return {
          accuracy: moveData.accuracy,
          power: moveData.power,
          pp: moveData.pp,
          priority: moveData.priority,
          type: moveData.type.name,
          learnedByPokemon: null, // Evitar referencias recursivas
        };
      },
    },
  };
  