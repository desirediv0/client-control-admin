import { gql } from "@apollo/client";

// users query and mutation
export const GET_USERS = gql`
  query Query {
    getUsers {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER = gql`
  query Query($getUserId: String!) {
    getUser(id: $getUserId) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation Mutation($updateUserId: String!, $name: String, $email: String) {
    updateUser(id: $updateUserId, name: $name, email: $email) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation Mutation($deleteUserId: String!) {
    deleteUser(id: $deleteUserId) {
      id
    }
  }
`;

// child query and mutation

export const GET_CHILD = gql`
  query GetChild($id: String!, $parentId: String!) {
    getChild(id: $id, parentId: $parentId) {
      id
      name
      email
      phone
      databaseUrl
      domain
      totalAmt
      joinDate
      password
    }
  }
`;

export const GET_CHILDREN_BY_PARENT_ID = gql`
  query GetChildrenByParentId(
    $parentId: String!
    $page: Int!
    $pageSize: Int!
  ) {
    getChildrenByParentId(
      parentId: $parentId
      page: $page
      pageSize: $pageSize
    ) {
      children {
        id
        name
        email
        phone
        domain
        databaseUrl
        totalAmt
        joinDate
        parentId
      }
      pageInfo {
        currentPage
        pageSize
        totalCount
        totalPages
      }
      totalChildren
    }
  }
`;

export const CREATE_CHILD = gql`
  mutation Mutation(
    $name: String!
    $email: String!
    $phone: String!
    $domain: String!
    $password: String!
    $databaseUrl: String!
    $joinDate: String!
    $totalAmt: Float!
    $parentId: String!
  ) {
    createChild(
      name: $name
      email: $email
      phone: $phone
      domain: $domain
      password: $password
      databaseUrl: $databaseUrl
      joinDate: $joinDate
      totalAmt: $totalAmt
      parentId: $parentId
    ) {
      id
      name
      email
      phone
      domain
      totalAmt
      databaseUrl
      joinDate
      createdAt
      updatedAt
      parentId
    }
  }
`;

export const DELETE_CHILD = gql`
  mutation Mutation($deleteChildId: String!) {
    deleteChild(id: $deleteChildId) {
      id
      parentId
    }
  }
`;

export const UPDATE_CHILD_STATUS = gql`
  mutation Mutation($updateChildStatusId: String!, $status: Boolean!) {
    updateChildStatus(id: $updateChildStatusId, status: $status) {
      id
      status
    }
  }
`;

export const UPDATE_CHILD_FIELD = gql`
  mutation UpdateChildField(
    $childId: String!
    $field: String!
    $value: String!
  ) {
    updateChildField(childId: $childId, field: $field, value: $value) {
      id
      name
      email
      phone
      domain
      databaseUrl
      totalAmt
      joinDate
    }
  }
`;

export const CHILD_SEARCH = gql`
  query ChildSearch($search: String!, $parentId: String!) {
    childSearch(search: $search, parentId: $parentId) {
      id
      name
      email
      phone
      domain
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($parentId: String!) {
    getDashboardData(parentId: $parentId) {
      userStatusData {
        name
        value
      }
      usersByParentData {
        name
        users
      }
      totalChildren
      activeChildren
      totalAmount
    }
  }
`;
