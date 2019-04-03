import get from 'lodash/get';

export const read = name => get(__runtimeConfigStatic, name); // eslint-disable-line no-undef
