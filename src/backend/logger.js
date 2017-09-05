const bunyan = require('bunyan');
const { inDevMode } = rootSrcRequire('utils');

// ----------------------------------------------------------------------------
const logger = bunyan.createLogger({
  name : 'HelpPortal',
  level : inDevMode() ? 'info' : 'error'
});

// ----------------------------------------------------------------------------
const logInfo   = logger.info.bind(logger);
const logWarn   = logger.warn.bind(logger);
const logError  = logger.error.bind(logger);

module.exports = { logInfo, logWarn, logError };
