const koarouter   = require('koa-router');
const {logInfo}   = backendRequire('logger');
const utils       = rootSrcRequire('utils');

const router = koarouter({prefix: '/ReactHello'});

router.use( require( './apiA'  ));
utils.inProduction() && router.use( require( './static' ));

logInfo(router.stack.map(i => i.path));

module.exports = router.routes();
