import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
  
export const cache = new InMemoryCache({
  addTypename: false,
});
  
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    localStorage.removeItem('sessionToken');
    // graphQLErrors.forEach(({ message }) => {
    //   if (message === 'Context creation failed: Session token expired' || message === 'Request Unauthorized.') {
    //   }
    // });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext(async ctx => {
  try {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      return {
        headers: {
          ...ctx,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    }
  } catch (error) {
    console.log('[apollo.ts > authLink]', error);
  }
  
  return { headers: ctx };
});
  
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_API_URL,
});
  
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
});
  
