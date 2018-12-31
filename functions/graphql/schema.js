const graphqlTools = require('graphql-tools');
const resolvers = require('./resolvers');
/**
Try this at:
https://us-central1-muffin-firebase.cloudfunctions.net/api/graphiql


mutation createAMonkey($input: MonkeyCreateInput!) {
  createMonkey(input: $input) {
    id
    name
  }
}

{
  "input": {
  	"name": "monkey X"
  }
}

 */
const schema = `
input MonkeyCreateInput {
  name: String
}
input MonkeyInput {
  id: String!
  name: String
}
input MonkeyDeleteInput {
  id: String!
}
type Monkey {
  id: String!
  name: String
}
type Query {
  monkeys: [Monkey]
}
type Mutation {
  createMonkey(input: MonkeyCreateInput!): Monkey
  updateMonkey(input: MonkeyInput): Monkey
  deleteMonkey(input: MonkeyDeleteInput): Monkey
}
`;
module.exports = graphqlTools.makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
