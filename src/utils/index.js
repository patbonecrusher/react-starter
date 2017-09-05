const R = require('ramda');

// When running jest, fetch is not available, since we are not running in the
// browser.  We  instead  rely  on  isomorphic-fetch.  isomorphic-fetch  only
// support absolute url.  A work  around is to prefix our url  with localhost
// when running  in test  mode.  Note that  process.env.NODE_ENV = 'test' was
// added to the wallaby.js config file.  Jest automatically defines it.
// ----------------------------------------------------------------------------
const testing = process.env.NODE_ENV === 'test';
/* ignore coverage */
const apiBaseUrl = `${testing ? 'http://localhost' : ''}`;

const inDevMode     = () =>  process.env.NODE_ENV === 'development';
const inProduction  = () =>  process.env.NODE_ENV === 'production';
const toBuffer      = str => new Buffer(str);
const jsonToString  = (o) => R.isNil(o) ? 'n/a' : JSON.stringify(o);
const jsonToBuffer  = R.compose(toBuffer, jsonToString);

module.exports = {
  inDevMode, inProduction,
  apiBaseUrl,
  toBuffer, jsonToString, jsonToBuffer
};
