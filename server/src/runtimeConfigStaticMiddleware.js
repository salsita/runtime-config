import _ from 'lodash';
import * as config from './config';

export const buildHandleRequest = () => (request, response) => {
  try {
    response.send(`__runtimeConfigStatic = ${JSON.stringify(config.getPublicConfig())}`);
  } catch (error) {
    console.error(error);
    response.status(500).send('Unable to send configuration.');
  }
};
