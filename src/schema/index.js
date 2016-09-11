// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

import { nodeField } from './relayNode';
import {
  agency,
} from './types';

export default new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
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
          return await agency.get(tag, context, info);
        },
      },
    },
  }),
});
