// @flow

import * as graphql from 'graphql';

import { nodeField } from './relayNode';
import { viewer } from './types';

export default new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      viewer: {
        type: viewer.type,
        resolve: viewer.get,
      },
    },
  }),
});
