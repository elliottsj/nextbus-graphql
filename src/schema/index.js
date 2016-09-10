// @flow

import * as graphql from 'graphql';
import * as relay from 'graphql-relay';

import { nodeField } from './relayNode';
import {
  agency as agencyType,
} from './types';

export default new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      agencies: (() => {
        const { connectionType } = relay.connectionDefinitions({
          name: 'Agency',
          nodeType: agencyType,
        });
        return {
          type: connectionType,
          args: relay.connectionArgs,
          async resolve(query, args, context) {
            const agencies = await context.nextbus.getAgencies();
            return relay.connectionFromArray(agencies, args);
          },
        };
      })(),
      agency: {
        type: agencyType,
        args: {
          tag: { type: graphql.GraphQLString },
        },
        async resolve(query, { tag }, context) {
          return await context.nextbus.getAgency(tag);
        },
      },
    },
  }),
});
