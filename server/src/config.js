// I’ve used Convict to read and validate my configuration. Convict lets you set
// a configuration schema for validation and it can also associate your configuration
// variables with env variables in a very convenient way. I believe that the key idea
// would work with other configuration tools alike.
import path from 'path';
import convict from 'convict';

const props = {
  config: null,
  publicConfig: {},
};

// Define a schema
// Convict lets us add parameters to the schema, so we can add `public`
// to denote that a variable shall be available to the client (and therefore
// to anybody on the Internet). The default value `false` for obvious reasons.
const schema = {
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "production",
    env: "NODE_ENV"
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port",
    public: true,
  },
  value1: {
    doc: "Client value 1.",
    format: "String",
    default: "I'm value 1.",
    env: "CLIENT_VALUE_1",
    public: true,
  },
  value2: {
    doc: "Client value 2.",
    format: "String",
    default: "I'm value 2.",
    env: "CLIENT_VALUE_2",
    public: true,
  },
  value3: {
    doc: "Value 3 which is private.",
    format: "String",
    default: "I'm value 3 - private.",
    env: "CLIENT_VALUE_3",
    public: false,
  }
};

// selectPublic is a function which picks only public variables from configuration.
// It enters the root schema object and recursively (DFS) goes through the schema
// and picks only those objects which contain public configuration. From those, it
// omits configuration variables which are not public.
const selectPublic = (node, nodePath = []) => {
  // is the current node a leave (no descendants with public variables)?
  let leave = true;
  // resulting object after filtering out private variables
  const filtered = {};

  for (let key in node) {
    if (node.hasOwnProperty(key) && typeof node[key] === 'object') {
      // recursive call
      const child = selectPublic(node[key], [...nodePath, key]);
      if (child != null) {
        leave = false;
        filtered[key] = child;
      }
    }
  }

  // if the subtree is a leave
  if (leave) {
    // if it is a public variable, return value, return null otherwise
    return (node.public === true) ? props.config.get(nodePath.join('.')) : null;
  } else {
    // return subtree containing only public variables
    return filtered;
  }
}

export const init = configDirPath => {
  // Use config schema
  props.config = convict(schema);
  // Load environment dependent configuration
  const env = props.config.get('env');
  const configPath = path.join(configDirPath, `${env}.json`);
  console.log(`Using config file: ${configPath}`);
  props.config.loadFile(configPath);
  // Perform validation
  props.config.validate({ allowed: 'strict' });
  // We want to keep the configuration values at hand, so we will call
  // selectPublic at the end of init function. This means that we pick the values
  // only once on initialization (and they don't change unless server is restarted).
  props.publicConfig = selectPublic(schema);
}

export const get = name => props.config.get(name);

// To make the values accessible outside of the module, add a getter for it.
// The getter also resolves the situation when publicConfig is empty.
export const getPublicConfig = () => props.publicConfig || {};
