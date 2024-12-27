import {ApolloServer} from "@apollo/server"
import {startStandaloneServer} from "@apollo/server/standalone";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";


const server = new ApolloServer({
    typeDefs : schema,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    context: async () => ({ depth: 0 }),
    listen: { port: 9090 },
});



console.log(`Server running on: ${url}`);