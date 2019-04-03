import "@babel/polyfill";
import Express from 'express';
import path from 'path';

import * as config from './config';
import * as runtimeConfigMiddleware from './runtimeConfigMiddleware';
import * as runtimeConfigStaticMiddleware from './runtimeConfigStaticMiddleware';

// common root directory to client and server
// The exotic relative rootPath is there for a simple reason. The project has
// two subdirectories, client and server. Server sources therefore reside in server/src
// and to get to project root, we need to go two levels up (../../).
const rootPath = path.join(__dirname, '../../');
const publicPath = path.join(rootPath, '/client/build');
const configDirPath = path.join(rootPath, '/server/config');
// initialize configuration
try {
  config.init(configDirPath);
} catch (error) {
  console.error(error);
}
const express = Express();
// Runtime configuration middleware
//
// Since we want to access the configuration on client, we add a new route to our
// Express server. The following simple middleware generates a javascript file where
// it assigns the configuration object to __runtimeConfig variable.This generated
// script will eventually run on client
//
// We add the middleware above the static server to grab the route first.The static
// server then handles the rest.
express.get(/\/runtimeConfig$/, runtimeConfigMiddleware.buildHandleRequest());
express.get(/\/runtimeConfigStatic\.js$/, runtimeConfigStaticMiddleware.buildHandleRequest());
// static file server
express.use(Express.static(publicPath));

const port = config.get('port');
express.listen(port, () => {
  console.log(`Server set to publish static files from: ${publicPath}`);
  console.log(`Listening at http://localhost:${port}/`);
  console.log('Press Ctrl+C to quit.');
});
