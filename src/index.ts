import express, { Request, Response } from "express";
import { router } from "./routes/routes";
import connects from "./config/db";
import { Server } from "http";
const app = express();
const PORT = 4011;
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
const { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
app.use("/", router);

const startApolloServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });
  console.log("apollo serveris running");
};

startApolloServer();

app.get("/test", (req: Request, resp: Response): void => {
  resp.json({ data: "test page" });
});
connects();
app.listen(PORT, (): void => {
  console.log(`Server is running on ${PORT}`);
});
