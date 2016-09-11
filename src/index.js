// @flow

import { apolloExpress, graphiqlExpress } from 'apollo-server';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import url from 'url';

import nextbus from './nextbus';
import schema from './schema';

const server = express()
  .use(morgan('tiny'))
  .use('/graphql', bodyParser.json(), apolloExpress(() => ({
    context: { nextbus: nextbus() },
    schema,
  })))
  .use('/', graphiqlExpress({ endpointURL: '/graphql' }))
  .listen(4000, () => {
    const address = server.address();
    console.info(`serving on ${url.format({
      protocol: 'http',
      hostname: address.address,
      port: address.port,
    })}`);
  });
