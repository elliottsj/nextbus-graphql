// @flow

import * as relay from 'graphql-relay';

import {
  agency,
  route,
  stop,
  viewer,
} from './types';

const { nodeInterface, nodeField } = relay.nodeDefinitions(
  async (globalId, context, info) => {
    const { type, id } = relay.fromGlobalId(globalId);
    switch (type) {
      case agency.type.name:
        return agency.getNode(id, context, info);
      case route.type.name:
        return route.getNode(id, context, info);
      case stop.type.name:
        return stop.getNode(id, context, info);
      case viewer.type.name:
        return viewer.getNode(id, context, info);
      default:
        throw new Error(`Invalid type "${type}" from global ID "${globalId}"`);
    }
  },
  (obj) => {
    switch (obj.type) {
      case agency.type.name:
        return agency.type;
      case route.type.name:
        return route.type;
      case stop.type.name:
        return stop.type;
      case viewer.type.name:
        return viewer.type;
      default:
        throw new Error(`Invalid object type "${obj.type}"`);
    }
  },
);

export { nodeInterface, nodeField };
