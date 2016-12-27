// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

import { nodeInterface } from '../relayNode';
import withType from '../withType';
import { agency } from '.';

export const type = new graphql.GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    id: relay.globalIdField('Viewer', () => 'viewer'),
    agencies: (() => {
      const { connectionType } = relay.connectionDefinitions({
        name: agency.type.name,
        nodeType: agency.type,
      });
      return {
        type: connectionType,
        args: relay.connectionArgs,
        async resolve(query, args, context) {
          const agencies = await agency.getAll(context);
          return relay.connectionFromArray(agencies, args);
        },
      };
    })(),
    agency: {
      type: agency.type,
      args: {
        tag: { type: graphql.GraphQLString },
      },
      async resolve(query, { tag }, context, info) {
        return agency.get(tag, context, info);
      },
    },
  }),
  interfaces: () => [nodeInterface],
});

export function get() {
  return withType(type.name, {});
}

export function getNode(id: string) {
  return get(id);
}
