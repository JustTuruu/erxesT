import { gql } from '@apollo/client';

// Template mutations
export const ADD_TEMPLATE = gql`
  mutation templateAdd($input: TemplateInput!) {
    templateAdd(input: $input) {
      _id
      name
      contentType
      status
    }
  }
`;

export const EDIT_TEMPLATE = gql`
  mutation templateEdit($_id: String!, $input: TemplateEditInput!) {
    templateEdit(_id: $_id, input: $input) {
      _id
      name
      contentType
      status
    }
  }
`;

export const REMOVE_TEMPLATE = gql`
  mutation templateRemove($_id: String!) {
    templateRemove(_id: $_id)
  }
`;

export const USE_TEMPLATE = gql`
  mutation templateUse(
    $_id: String!
    $contentType: String
    $relTypeId: String
  ) {
    templateUse(_id: $_id, contentType: $contentType, relTypeId: $relTypeId)
  }
`;

// Category mutations
const categoryParams = `
    $name: String, 
    $parentId: String, 
    $code: String, 
    $contentType: String
`;

const categoryVariables = `
    name: $name, 
    parentId: $parentId, 
    code: $code, 
    contentType: $contentType
`;

const categoryAdd = `
  mutation categoryAdd(${categoryParams}) {
    categoryAdd(${categoryVariables}) {
      _id
    }
  }
`;

const categoryEdit = `
  mutation categoryEdit($_id: String!, ${categoryParams}) {
    categoryEdit(_id: $_id, ${categoryVariables}) {
      _id
    }
  }
`;

const categoryRemove = `
  mutation categoryRemove($_id: String!) {
    categoryRemove(_id: $_id)
  }
`;

export default {
  // Template mutations
  ADD_TEMPLATE,
  EDIT_TEMPLATE,
  REMOVE_TEMPLATE,
  USE_TEMPLATE,

  // Category mutations
  categoryAdd,
  categoryEdit,
  categoryRemove,
};
