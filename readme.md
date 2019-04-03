# Runtime Client-Side Configuration
Sample project demonstrating how to access configuration and environment variables in browser on runtime.

## Usage
- Navigate to root directory.
- `npm install`
- `npm run build`
- `npm start`

## Environment
This is built with
- Ubuntu 18.0.4
- Node v10.9.0
- npm 6.7.0

I suppose it would work on similar unix-like setups too.

## Source
The source code is split into two subfolders, `client` and `server`, each having its own `package.json`.
### Server
The server entry point is located in `server/src/srver.js` and it calls two more modules, `config` and `runtimeConfigMiddleware`.
### Client
The app is created with [create-react-app](https://facebook.github.io/create-react-app/). There are only a few changes to this basic client application.
- A new file `runtimeConfig.js` is added. It loads and stores the configuration variables.
- `index.js` is the entry point and it calls the runtime configuration `load` function as soon as possible.
- The values are displayed in `App.js` component. They are fetched on `componentDidMount` and displayed as soon as they are available.
