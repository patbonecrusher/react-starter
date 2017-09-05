const koa         = require('koa');
const koarouter   = require('koa-router');
const path        = require('path');
const sendfile    = require('koa-sendfile');
const R           = require('ramda');
const utils       = rootSrcRequire('utils');

const router      = koarouter();

const registerRoute = route => router.get(route, async (ctx, next) => {
  await sendfile(ctx, path.join(__dirname, '../../../public', 'index.html'));
  if (!ctx.status) ctx.throw(404);
});

R.map(registerRoute)(['/routeA', '/routeB', '/routeC', '/routeD']);

module.exports = router.routes();
