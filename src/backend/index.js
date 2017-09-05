global.backendRequire = (name) => require(__dirname + '/' + name);
global.rootSrcRequire = (name) => require(__dirname + '/../' + name);
global.rootRequire    = (name) => require(__dirname + '/../../' + name);

const koa       = require('koa');
const koaBody   = require('koa-body');
const serve     = require('koa-static');
const mount     = require('koa-mount');
const R         = require('ramda');

const logSvc    = backendRequire('logger');
const utils     = rootSrcRequire('utils');
const config    = rootSrcRequire('config.json');

const port      = process.env.PORT  || 9000;
const ip        = process.env.IP    || '0.0.0.0';

// ----------------------------------------------------------------------------
(async function start () {
  const addKoaBody        = app => (app.use(koaBody()), app);
  const addStaticContent  = app => (utils.inProduction() && app.use(mount('/ReactHello', serve(__dirname + '/../../public', {defer: true}))), app);
  const addOurRoutes      = app => (app.use(backendRequire('routes')), app);
  const createKoaApp      = R.pipe(R.construct(koa), addKoaBody, addStaticContent, addOurRoutes);
  const app               = createKoaApp();

  startApp (app);
}) ();

// Helpers
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
function startApp (app) {
  logSvc.logInfo(`starting app on port ${port} at ip ${ip}`);
  if (!module.parent) setImmediate(() => app.listen(port));
}
