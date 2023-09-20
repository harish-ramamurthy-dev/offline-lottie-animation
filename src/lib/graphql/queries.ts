export const publicAnimationsQuery = `
  query PublicAnimations($after: String, $before: String, $first: Int, $last: Int) {
    featuredPublicAnimations(after: $after, before: $before, first: $first, last: $last) {
      edges {
        cursor
        node {
          id
          bgColor
          jsonUrl
          name
          description
          downloads
          createdBy {
            avatarUrl
            firstName
            lastName
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

export const searchPublicAnimationsQuery = `
  query SearchPublicAnimations($after: String, $before: String, $first: Int, $last: Int, $query: String!) {
    searchPublicAnimations(after: $after, before: $before, first: $first, last: $last, query: $query) {
      edges {
        cursor
        node {
          id
          bgColor
          jsonUrl
          name
          description
          downloads
          createdBy {
            avatarUrl
            firstName
            lastName
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;
