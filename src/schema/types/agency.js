// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

import { nodeInterface } from '../relayNode';

export default new graphql.GraphQLObjectType({
  name: 'Agency',
  fields: {
    id: relay.globalIdField('Agency', agency => agency.tag),
    regionTitle: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    shortTitle: {
      type: graphql.GraphQLString,
    },
    tag: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    title: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
  },
  interfaces: () => [nodeInterface],
});
