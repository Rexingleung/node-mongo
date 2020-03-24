const koa = require('koa');
const app = new koa();
const static = require('koa-static'); // 注册位置, 在错误处理的下面, 路由相应之前
const path = require('path');
const fs = require('fs')
// 数据库链接
const mongoose = require('./models/mongoose');
const model = require('./models/vip');

const session = require('koa-session');
const redisStore = require('koa-redis');
const redis = require('redis');
const cookieParser = require('cookie-parser');


const bodyParser = require('koa-bodyparser'); // 在静态文件服务下注册

//链接redis
const redisClient = redis.createClient(6379, 'localhost')

// 引入自己封装的中间件
const getVip = require('./middleware/get-vip');

// vip课程查询的中间件
app.use(getVip);
// app.use(cookieParser())

// key 的作用, 用来对cookie进行签名的
app.keys = ['some secret', 'another secret'];
// session是针对cookie的
const SESS_CONFIG = {
    key: 'kkb:sess', // 设置cookie中的key值, sid koa , session
    maxAge: 86400000, // 有效期: 默认是一天
    httpOnly: true, // 仅能服务器端修改
    signed: true, // 签名cookie
    store: redisStore({ redisClient }), // 使用redis作为储存数据
}
// 引入模板引擎
const hbs = require('koa-hbs');
// const helps = require('./utils/helps.js');
// app.use(helps)

app.use(hbs.middleware({
    viewPath: path.resolve(__dirname + '/views'), // 视图层根目录. 去哪个文件夹去拿我们最终的视图, 相当于vue里面等template
    defaultLayout: 'layout', // 默认布局页面, 这个layout目录相对于上面的viewPath的目录
    partialsPath: path.resolve(__dirname + '/views/partials'), // 注册partial目录, 相当于组件等概念
    disableCache: true, // 开发阶段不设置缓存
}))

const index = require('./routes/index')
const users = require('./routes/users')
// 第二步: 注册路由, 一定要在通用中间件后面


// 中间件框架
// app.use(中间件), 里面的中间件是一个异步函数, 对用户的请求和响应做预处理

// 错误处理中间件, 写在最上面
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        // 系统日志

        // 给用户显示信息
        console.log(error);

        ctx.status = error.statusCode || error.status || 500;
        // ctx.type = 'json' 
        ctx.body = { ok: 0, message: error };

        //全局错误处理
        ctx.app.emit('error', error.message)

    }
})
// 静态文件服务
// const staticPath = path.resolve(__dirname+ '/public')
// app.use(static(staticPath))
app.use(bodyParser())
app.use(async (ctx, next) => {
    // 获取响应头, 印证执行程序顺序
    await next()
    const rt = ctx.response.get('X-Response-Time');
    console.log(`输出时 : ${ctx.method} ${ctx.url} - ${rt}`);
})

// session配置 放在静态文件的后面
app.use(session(SESS_CONFIG, app));
// app.use(cookieParser())
// 注释这行代码 ,否则会终止我们的代码返回
// app.use(async (ctx, next) => {
//     await next();
//     if(ctx.path === '/favicon.ico') return
//     // 储存session
//     let n = ctx.session.conunt || 0;
//     // 获取session
//     ctx.session.conunt = ++n;
//     ctx.body = `第${n}次访问`;
//     redisClient.keys('*', (err, keys) => {
//         console.log(keys);
//         keys.forEach((key, index) => {
//             redisClient.get(key, (err, val) => {
//                 console.log(val);
//             })
//         })
//     })
// })

//响应时间统计中间件
app.use(async (ctx, next) => {
    const start = Date.now();
    console.log('开始计时');
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    console.log('计时结束');
})

// app.use(async (ctx, next) => {
//     // 查询错误, 用户级错误
//     throw new Error('未知错误');
//     // 第一段 : ctx.throw('401', '认证失败')

//     /* 第二段 :  const err = new Error('认证失败');
//     err.status = 401;
//     err.expose = true; // 设置为true, 则为用户级代码
//     throw err;*/
//     // 第一段代码和第二段代码是相等的 
//     next();
// })

// 响应用户请求 
// app.use(ctx => {
//     console.log('响应用户请求');
//     ctx.status = 200; // 设置响应状态码
//     ctx.type = 'html'; // 设置相应类型, 等效于ctx.set('Content-Type', "text/html");
//     ctx.body = '<h1>213</h1>'

// });
// // 监听全局的错误时间
// app.on('error', err => {
//     // console.error(err)
// })
// 注册路由
app.use(index.routes())
app.use(users.routes())


// 开始监听端口, 等同于http.createServer(app.callback()).listen(3000);
app.listen(3000);

