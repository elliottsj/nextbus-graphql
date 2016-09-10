// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

import { nodeInterface } from '../relayNode';
import { stop as stopType } from '.';

import type { RouteConfig } from '../../nextbus';

export default new graphql.GraphQLObjectType({
  name: 'Route',
  description: 'A route for an agency',
  fields: () => ({
    id: relay.globalIdField('Route', route => `${route.agencyTag}:${route.tag}`),
    // Need agency tag here so id above is globally unique: route tags by themselves are not unique
    // since multiple agencies can have identical route tags.
    agencyTag: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      description: 'The tag of the agency to which this route belongs',
    },
    color: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      async resolve(route, args, context) {
        return (await context.nextbus.getRoute(route.agencyTag, route.tag)).color;
      },
    },
    latMax: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
      async resolve(route, args, context) {
        return (await context.nextbus.getRoute(route.agencyTag, route.tag)).latMax;
      },
    },
    latMin: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
    },
    lonMax: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
    },
    lonMin: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
    },
    oppositeColor: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    shortTitle: {
      type: graphql.GraphQLString,
    },
    stops: (() => {
      const { connectionType } = relay.connectionDefinitions({
        name: 'Stop',
        nodeType: stopType,
      });
      return {
        type: connectionType,
        args: relay.connectionArgs,
        async resolve(route, args, context) {
          const stops = (await context.nextbus.getRoute(route.agencyTag, route.tag)).stops;
          return relay.connectionFromArray(stops, args);
        },
      };
    })(),
    tag: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    title: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
  }),
  interfaces: () => [nodeInterface],
});
