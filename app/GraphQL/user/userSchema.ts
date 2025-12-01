const userSchema = `#graphql

scalar DateTime

type User {
  id: String!
  name: String!
  email: String!
  password: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  getUsers: [User]
  getUser(id: String!): User
}

type Mutation {
  createUser(name: String, email: String!, password: String!): User
  updateUser(id: String!, name: String, email: String): User
  deleteUser(id: String!): User
}

schema {
  query: Query
  mutation: Mutation
}
`;

export default userSchema;
