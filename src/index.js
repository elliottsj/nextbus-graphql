// @flow

import { apolloExpress, graphiqlExpress } from 'apollo-server';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import url from 'url';

import schema from './schema';

const server = express()
  .use(morgan('tiny'))
  .use('/graphql', bodyParser.json(), apolloExpress({ schema }))
  .use('/', graphiqlExpress({ endpointURL: '/graphql' }))
  .listen(3000, () => {
    const address = server.address();
    console.info(`serving on ${url.format({
      protocol: 'http',
      hostname: address.address,
      port: address.port,
    })}`);
  });
