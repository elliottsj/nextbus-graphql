// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

import { nodeInterface } from '../relayNode';
import withType from '../withType';
import { stop } from '.';

import type { RouteConfig } from '../../nextbus';

const encodeID = ([agencyTag, routeTag]) => `${agencyTag}:${routeTag}`;
const decodeID = (id) => id.split(':');

export const type = new graphql.GraphQLObjectType({
  name: 'Route',
  description: 'A route for an agency',
  fields: () => ({
    id: relay.globalIdField('Route', route => encodeID([route.agencyTag, route.tag])),
    // Need agency tag here so id above is globally unique: route tags by themselves are not unique
    // since multiple agencies can have identical route tags.
    agencyTag: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      description: 'The tag of the agency to which this route belongs',
    },
    color: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      async resolve(route, args, context) {
        return (await get(route.agencyTag, route.tag, context)).color;
      },
    },
    latMax: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
      async resolve(route, args, context) {
        return (await get(route.agencyTag, route.tag, context)).latMax;
      },
    },
    latMin: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
      async resolve(route, args, context) {
        return (await get(route.agencyTag, route.tag, context)).latMin;
      },
    },
    lonMax: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
      async resolve(route, args, context) {
        return (await get(route.agencyTag, route.tag, context)).lonMax;
      },
    },
    lonMin: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLFloat),
      async resolve(route, args, context) {
        return (await get(route.agencyTag, route.tag, context)).lonMin;
      },
    },
    oppositeColor: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      async resolve(route, args, context) {
        return (await get(route.agencyTag, route.tag, context)).oppositeColor;
      },
    },
    shortTitle: {
      type: graphql.GraphQLString,
      async resolve(route, args, context) {
        return (await get(route.agencyTag, route.tag, context)).shortTitle || null;
      },
    },
    stops: (() => {
      const { connectionType } = relay.connectionDefinitions({
        name: stop.type.name,
        nodeType: stop.type,
      });
      return {
        type: connectionType,
        args: relay.connectionArgs,
        async resolve(route, args, context) {
          const stops = await stop.getAll(route.agencyTag, route.tag, context);
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

export async function get(
  agencyTag: string,
  routeTag: string,
  context: Object,
): Promise<RouteConfig> {
  return withType(type.name, await context.nextbus.getRoute(agencyTag, routeTag));
}

export function getNode(id: string, context: Object, info: Object) {
  const [agencyTag, routeTag] = decodeID(id);
  return get(agencyTag, routeTag, context, info);
}
