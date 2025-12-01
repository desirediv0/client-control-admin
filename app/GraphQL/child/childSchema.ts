const childSchema = `#graphql

scalar DateTime

type Child {
  id: String!
  name: String!
  email: String!
  phone: String!
  domain: String!
  totalAmt: Float!
  password: String!
  joinDate: String!
  databaseUrl: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  parentId: String!
  parent: User
}

type User {
  id: String!
  name: String
  email: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  children: [Child!]!
  parentId: String
  parent: User
  childrenUsers: [User!]!
}

type PageInfo {
  currentPage: Int!
  pageSize: Int!
  totalCount: Int!
  totalPages: Int!
}

type ChildrenResponse {
  children: [Child!]!
  pageInfo: PageInfo!
  totalChildren: Int!
}

type DashboardData {
  userStatusData: [StatusData!]!
  usersByParentData: [ParentData!]!
  totalChildren: Int!
  activeChildren: Int!
  totalAmount: Float!
}

type StatusData {
  name: String!
  value: Int!
}

type ParentData {
  name: String!
  users: Int!
}

type Query {
  getChild(id: String!, parentId: String!): Child
  getChildrenByParentId(parentId: String!, page: Int!, pageSize: Int!): ChildrenResponse!
  childSearch(search: String!, parentId: String!): [Child!]!
  getDashboardData(parentId: String!): DashboardData!
}

type Mutation {
  createChild(name: String!, email: String!, phone: String!, domain: String!, totalAmt: Float!, parentId: String!, joinDate: String!, databaseUrl: String!, 
    password: String!
  ): Child!
  deleteChild(id: String!): Child!
  updateChildField(childId: String!, field: String!, value: String!): Child!
}

`;

export default childSchema;
