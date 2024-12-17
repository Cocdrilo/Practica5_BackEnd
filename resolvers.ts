import {Pokemon} from "./types.ts";

const PokeApi_url = "https://pokeapi.co/api/v2/"

const fetchFromPokeAPI = async (endpoint: string) => {
    const response = await fetch(`${PokeApi_url}/${endpoint}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    return response.json();
};


export const resolvers = {
    Query:{
        getPokemon: async (_:unknown,args:{id:number,name:string})=>{
            return await fetchFromPokeAPI(`pokemon/${args.id || args.name}`);
        }
    },

    AbilitySlot: {
        ability: async (parent: any) => await fetchFromPokeAPI(`ability/${parent.ability.name}`),
    },

    Ability: {
        url: async (parent: any) => await fetchFromPokeAPI(parent.url)
    },


}