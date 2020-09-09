/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAddress = /* GraphQL */ `
  mutation CreateAddress(
    $input: CreateAddressInput!
    $condition: ModelAddressConditionInput
  ) {
    createAddress(input: $input, condition: $condition) {
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
export const updateAddress = /* GraphQL */ `
  mutation UpdateAddress(
    $input: UpdateAddressInput!
    $condition: ModelAddressConditionInput
  ) {
    updateAddress(input: $input, condition: $condition) {
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
export const deleteAddress = /* GraphQL */ `
  mutation DeleteAddress(
    $input: DeleteAddressInput!
    $condition: ModelAddressConditionInput
  ) {
    deleteAddress(input: $input, condition: $condition) {
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
