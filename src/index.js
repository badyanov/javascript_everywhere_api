const express = require('express');

if (process.env.NODE_ENV !== 'dev') {
  console.log('This is prod configuration!');
  require('dotenv').config();
}

const { ApolloServer, gql } = require('apollo-server-express');

const port = process.env.PORT || 4000;

// Построение схемы с использованием GraphQL
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Функция разрешения для полей схемы
const resolvers = {
  Query: {
    hello: () => 'Hello, world from QraphQL!',
  },
};

const startApolloServer = async () => {
  // Настройка ApolloServer
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  const app = express();

  // Применяем промежуточное ПО Apollo GraphQL и указываем путь к API
  server.applyMiddleware({ app, path: '/api' });

  await new Promise((resolve) => app.listen({ port: port }, resolve));
  console.log(
    `🚀 GraphQL server running at http://localhost:${port}${server.graphqlPath}...`
  );
};

startApolloServer(typeDefs, resolvers);
