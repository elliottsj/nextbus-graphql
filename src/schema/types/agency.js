// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

import { nodeInterface } from '../relayNode';
import withType from '../withType';
import { route } from '.';

import type { Route } from '../../nextbus';

export const type = new graphql.GraphQLObjectType({
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
        name: route.type.name,
        nodeType: route.type,
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
      type: route.type,
      args: {
        tag: { type: graphql.GraphQLString },
      },
      async resolve(agency, { tag }, context): Promise<Route> {
        return route.get(agency.tag, tag, context);
      },
    },
  }),
  interfaces: () => [nodeInterface],
});

export async function get(tag: string, context: Object) {
  return withType(type.name, await context.nextbus.getAgency(tag));
}

export async function getAll(context: Object) {
  return (await context.nextbus.getAgencies()).map(withType(type.name));
}

export async function getNode(id: string, context: Object) {
  return get(id, context);
}
