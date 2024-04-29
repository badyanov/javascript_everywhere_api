const express = require('express');

if (process.env.NODE_ENV !== 'dev') {
  console.log('This is prod configuration!');
  require('dotenv').config();
}

const { ApolloServer, gql } = require('apollo-server-express');

const port = process.env.PORT || 4000;

// Данные заметок временно хранятся в переменной notes
let notes = [
  { id: '1', author: 'Dmitriy', content: 'This is my first note!' },
  { id: '2', author: 'Dmitriy', content: 'This is another my note!' },
  {
    id: '3',
    author: 'Vasya',
    content: "OMG! What's this? This is someone else's note!",
  },
];

// Построение схемы с использованием GraphQL
const typeDefs = gql`
  type Query {
    hello: String!
    notes: [Note!]!
    note(id: ID!): Note
  }

  type Note {
    id: String
    author: String
    content: String
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`;

// Функция разрешения для полей схемы
const resolvers = {
  Query: {
    hello: () => 'Hello, world from QraphQL!',
    notes: () => notes,
    note: (parent, args) => {
      return notes.find((note) => note.id === args.id);
    },
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        author: 'Dmitriy',
        content: args.content,
      };
      notes.push(noteValue);
      return noteValue;
    },
  },
};

const app = express();
app.get('/', (req, res) => res.send('Hello, World from Express.js!'));

const startApolloServer = async () => {
  // Настройка ApolloServer
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  // Применяем промежуточное ПО Apollo GraphQL и указываем путь к API
  server.applyMiddleware({ app, path: '/api' });

  await new Promise((resolve) => app.listen({ port: port }, resolve));
  console.log(
    `🚀 GraphQL server running at http://localhost:${port}${server.graphqlPath}...`
  );
};

startApolloServer(typeDefs, resolvers);
