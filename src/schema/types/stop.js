// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

import { nodeInterface } from '../relayNode';
import withType from '../withType';

const encodeID = ([agencyTag, routeTag, stopTag]) => `${agencyTag}:${routeTag}:${stopTag}`;
const decodeID = (id) => id.split(':');

export const type = new graphql.GraphQLObjectType({
  name: 'Stop',
  description: 'A stop along a route',
  fields: () => ({
    id: relay.globalIdField('Stop', stop => encodeID([stop.agencyTag, stop.routeTag, stop.tag])),
    agencyTag: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      description: 'The tag of the agency to which this stop belongs',
    },
    lat: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      async resolve(stop, args, context) {
        return stop.lat || (await get(stop.agencyTag, stop.routeTag, stop.tag, context)).lat;
      },
    },
    lon: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
    },
    routeTag: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      description: 'The tag of the route to which this stop belongs',
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
  interfaces: () => [nodeInterface],
});

export async function getAll(agencyTag: string, routeTag: string, context: Object) {
  return (await context.nextbus.getRoute(agencyTag, routeTag)).stops.map(
    stop => withType(type.name, {
      ...stop,
      agencyTag,
      routeTag,
    })
  );
}

export async function get(agencyTag: string, routeTag: string, stopTag: string, context: Object) {
  const stop = (await getAll(agencyTag, routeTag, context)).find(s => s.tag === stopTag);
  if (stop) {
    return stop;
  }
  throw new Error(
    `No stop for agency tag "${agencyTag}", route tag "${routeTag}", stop tag "${stopTag}"`
  );
}

export function getNode(id: string, context: Object, info: Object) {
  const [agencyTag, routeTag, stopTag] = decodeID(id);
  return get(agencyTag, routeTag, stopTag, context, info);
}
