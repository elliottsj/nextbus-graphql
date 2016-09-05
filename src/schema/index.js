import * as graphql from 'graphql';
import * as relay from 'graphql-relay';
import nextbus from 'nextbus';

import { nodeField } from './relayNode';
import {
  agency as agencyType,
} from './types';

const nb = nextbus();

export default new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      allAgencies: (() => {
        const { connectionType } = relay.connectionDefinitions({
          name: 'Agency',
          nodeType: agencyType,
          connectionFields: {
            totalCount: {
              type: graphql.GraphQLInt,
              resolve(conn) {
                console.log('conn', conn);
                return 5;
              },
              description: 'test',
            },
          },
        });
        return {
          type: connectionType,
          args: relay.connectionArgs,
          async resolve(root, args) {
            const agencies = await nb.getAgencies();
            return relay.connectionFromArray(agencies, args);
          },
        };
      })(),
      agency: {
        type: agencyType,
        args: {
          tag: { type: graphql.GraphQLString },
        },
        resolve(root, { tag }) {
          return {
            tag: 'ttc',
            title: 'Toronto Transit Commission',
          };
        },
      },
    },
  }),
});
