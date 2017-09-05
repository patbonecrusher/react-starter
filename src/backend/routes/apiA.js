const koarouter   = require('koa-router');
const router      = koarouter({prefix: '/api/A'});

router.get('/', handleGet);

module.exports = router.routes();

async function handleGet (ctx, next) {
  ctx.body = 'hello world';
  ctx.response.status = 200;
}
