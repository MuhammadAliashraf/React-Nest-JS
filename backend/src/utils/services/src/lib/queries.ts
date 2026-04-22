export const countriesQuery = {
  query: `
    {
      countries(page: { first: 300 }) {
        totalCount
        edges {
          node {
            id
            name
            iso2
          }
        }
      }
    }
  `,
  variables: {},
};

export const statesQuery = (countryId: string) => {
  return {
    query: `
    {
      states(filter: { ciso2: "${countryId}" }, page: { first: 300 }) {
        totalCount
        edges {
          node {
            id
            name
            state_code
            country_id
          }
        }
      }
    }`,
    variables: {},
  };
};

export const citiesQuery = (countryCode: string, stateCode?: string) => {
  if (!stateCode) {
    return {
      query: `
    {
      cities(filter: { ciso2: "${countryCode}" }, page: { first: 999 }) {
        totalCount
        edges {
          node {
            id
            name
            state_code
            country_code
          }
        }
      }
    }`,
      variables: {},
    };
  }
  return {
    query: `
    {
      cities(filter: { ciso2: "${countryCode}", siso: "${stateCode}" }, page: { first: 300 }) {
        totalCount
        edges {
          node {
            id
            name
            state_code
            country_code
          }
        }
      }
    }`,
    variables: {},
  };
};
