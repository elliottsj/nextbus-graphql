// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

import { nodeInterface } from '../relayNode';
import { route as routeType } from '.';

import type { Route } from '../../nextbus';

export default new graphql.GraphQLObjectType({
  name: 'Agency',
  fields: () => ({
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
    routes: (() => {
      const { connectionType } = relay.connectionDefinitions({
        name: 'Route',
        nodeType: routeType,
      });
      return {
        type: connectionType,
        args: relay.connectionArgs,
        async resolve(agency, args, context) {
          const routes = await context.nextbus.getRoutes(agency.tag);
          return relay.connectionFromArray(routes, args);
        },
      };
    })(),
    route: {
      type: routeType,
      args: {
        tag: { type: graphql.GraphQLString },
      },
      async resolve(agency, { tag }, context): Promise<Route> {
        return await context.nextbus.getRoute(agency.tag, tag);
      },
    },
  }),
  interfaces: () => [nodeInterface],
});
