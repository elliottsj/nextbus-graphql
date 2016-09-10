// @flow

import * as relay from 'graphql-relay';

import {
  agency as agencyType,
} from './types';

const { nodeInterface, nodeField } = relay.nodeDefinitions(
  async (globalId) => {
    const { type, id } = relay.fromGlobalId(globalId);
    if (type === 'Agency') {
      return {
        _type: 'agency',
        tag: 'ttc',
        title: 'Toronto Transit Commission',
      };
    }
    throw new Error(`Invalid type "${type}"`);
  },
  (obj) => {
    if (obj._type === 'agency') {
      return agencyType;
    }
    throw new Error(`Invalid object type "${obj._type}"`);
  },
);

export { nodeInterface, nodeField };
