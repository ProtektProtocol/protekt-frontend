/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAddress = /* GraphQL */ `
  query GetAddress($addr: ID!) {
    getAddress(addr: $addr) {
      addr
      isContract
      balBalance
      balPercentOwnership
      balCategory
      balStatus
      balChange30d
      balChange7d
      balRecv
      balDaysSinceFirstReceived
      balFirstReceivedAt
      nansenLink
      etherscanLink
      balLabels
      createdAt
      updatedAt
    }
  }
`;
export const listAddresss = /* GraphQL */ `
  query ListAddresss(
    $addr: ID
    $filter: ModelAddressFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAddresss(
      addr: $addr
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        addr
        isContract
        balBalance
        balPercentOwnership
        balCategory
        balStatus
        balChange30d
        balChange7d
        balRecv
        balDaysSinceFirstReceived
        balFirstReceivedAt
        nansenLink
        etherscanLink
        balLabels
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const addressesByStatus = /* GraphQL */ `
  query AddressesByStatus(
    $balStatus: AddressStatus
    $balBalance: ModelFloatKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAddressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    addressesByStatus(
      balStatus: $balStatus
      balBalance: $balBalance
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        addr
        isContract
        balBalance
        balPercentOwnership
        balCategory
        balStatus
        balChange30d
        balChange7d
        balRecv
        balDaysSinceFirstReceived
        balFirstReceivedAt
        nansenLink
        etherscanLink
        balLabels
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const addressesByCategory = /* GraphQL */ `
  query AddressesByCategory(
    $balCategory: String
    $balBalance: ModelFloatKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAddressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    addressesByCategory(
      balCategory: $balCategory
      balBalance: $balBalance
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        addr
        isContract
        balBalance
        balPercentOwnership
        balCategory
        balStatus
        balChange30d
        balChange7d
        balRecv
        balDaysSinceFirstReceived
        balFirstReceivedAt
        nansenLink
        etherscanLink
        balLabels
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchAddresss = /* GraphQL */ `
  query SearchAddresss(
    $filter: SearchableAddressFilterInput
    $sort: SearchableAddressSortInput
    $limit: Int
    $nextToken: String
  ) {
    searchAddresss(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        addr
        isContract
        balBalance
        balPercentOwnership
        balCategory
        balStatus
        balChange30d
        balChange7d
        balRecv
        balDaysSinceFirstReceived
        balFirstReceivedAt
        nansenLink
        etherscanLink
        balLabels
        createdAt
        updatedAt
      }
      nextToken
      total
    }
  }
`;
