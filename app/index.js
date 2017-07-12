import React from 'react';
import Router from './containers/router';
import { Provider } from 'react-redux';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'

import store from './redux/store';

const networkInterface = createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/cj516g2j0ivyf0175u5vt8ob5' })
const client = new ApolloClient({ networkInterface });

const createPostMutation = gql`
  mutation ($description: String!, $imageUrl: String!){
    createPost(description: $description, imageUrl: $imageUrl) {
      id
    }
  }
`;

const app = () => (
  <ApolloProvider client={client}>

  <Provider store={store}>
    <Router />
  </Provider>
</ApolloProvider>

);

export default app;
