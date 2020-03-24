const Router = require('koa-router');
const router = new Router();

router.get('/', async (ctx, next) => {
    // ctx.body = 'index'
    //渲染页面
    await ctx.render('index'); // 以后渲染的目录就是views目录下的index.hbs
});
module.exports = router