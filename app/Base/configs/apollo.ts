import {
    ApolloClientOptions,
    NormalizedCacheObject,
    InMemoryCache,
    ApolloLink as ApolloLinkFromClient,
    HttpLink,
} from '@apollo/client';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT as string;

const link: ApolloLinkFromClient = ApolloLinkFromClient.concat(
    new ApolloLinkFromClient((operation, forward) => {
        // add the authorization to the headers
        operation.setContext(({ headers = {} }) => {
            const langValueFromStorage = localStorage.getItem('lang');
            let lang = 'np';
            if (langValueFromStorage) {
                lang = JSON.parse(langValueFromStorage);
            }
            return {
                headers: {
                    ...headers,
                    'Accept-Language': lang,
                },
            };
        });
        return forward(operation);
    }),
    // new RetryLink(),
    new HttpLink({
        uri: GRAPHQL_ENDPOINT,
        credentials: 'include',
    }),
) as unknown as ApolloLinkFromClient;

const apolloOptions: ApolloClientOptions<NormalizedCacheObject> = {
    link,
    cache: new InMemoryCache({
        typePolicies: {
            ModeratorQueryType: {
                keyFields: [], // empty keyFields means the ModeratorQueryType is a singleton object
            },
        },
    }),
    assumeImmutableResults: true,
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        watchQuery: {
            fetchPolicy: 'network-only',
            nextFetchPolicy: 'cache-only',
            errorPolicy: 'all',
        },
    },
};

export default apolloOptions;
