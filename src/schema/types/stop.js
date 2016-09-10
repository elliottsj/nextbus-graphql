// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

export default new graphql.GraphQLObjectType({
  name: 'Stop',
  description: 'A stop along a route',
  fields: () => ({
    lat: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    lon: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    shortTitle: {
      type: graphql.GraphQLString,
    },
    stopId: {
      type: graphql.GraphQLString,
    },
    tag: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    title: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
  }),
});
