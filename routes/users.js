const Router = require('koa-router');
const auth = require('../middleware/auth');
// const loginAuth = require('../middleware/loginAuth');
const mongoose = require('mongoose');
const svgCaptcha = require('svg-captcha');
// 密码加密方式
const bcrypt = require('bcrypt');
// jsonwebtoken令牌生成模块
const jwt = require('jsonwebtoken');
// jwt整合到koa中, koa的jwt中间件, 作用是认证令牌的合法性
const jwtAuth = require('koa-jwt');

// 模拟令牌
const secret = "it's a secret"
let cap;
const userSchema = mongoose.Schema({
    username: String,
    password: String
});
const userModel = mongoose.model('userList', userSchema);
async function insertUser(username, pwd) {
    await userModel.insertMany([
        {
            username,
            password: pwd
        }
    ])
}
const loginAuth = async (ctx, next) => {
    const body = ctx.request.body;
    const password = ctx.request.body.query.password;
    const un = await userModel.findOne({ 'username': body.query.username });
    const regCode = body.query.regCode.toLowerCase()
    const regText = cap.text.toLowerCase()
    // 获取密码的hash值
    const isPwd = bcrypt.compareSync(password, un.password);

    if (!un) {
        ctx.status = 401;
        ctx.body = {
            ok: 0,
            msg: '用户不存在'
        }
    } else if (un && !isPwd) {
        ctx.status = 401;
        ctx.body = {
            ok: 0,
            msg: '密码错误'
        }
    } else if (regCode !== regText) {
        ctx.status = 200;
        ctx.body = {
            ok: 0,
            msg: '验证码'
        }
    } else {
        await next()
    }
}
// 相当于 /users
const router = new Router();
// new Router({ prefix: "/users" })

// router.get('/', ctx => {
//     ctx.body = 'users list'
// });
// 如上new Router({ prefix: "/users" });相等
router.get('/users', async ctx => {
    await ctx.render('users', {
        title: '用户列表',
        subTitle: 'handlebars语法',
        isShow: true,
        username: 'jerry',
        users: [
            { username: "tom", age: 20, birthday: new Date(1999, 00, 01) },
            { username: "jerry", age: 21, birthday: new Date(1998, 00, 01) },

        ]
    })
});
// 验证码
router.get('/regCode', async (ctx, next) => {
    cap = await svgCaptcha.create();
    // ctx.session.getCode = cap.text
    ctx.status = 200;
    ctx.body = {
        ok: 0,
        msg: '',
        data: {
            code: cap.data
        }
    }
})
router.post('/login', loginAuth, async (ctx, next) => {
    ctx.status = 200;
    const body = ctx.request.body;
    const cookie = ctx.request.cookie;

    // 登录成功
    // 保存session
    ctx.session.userinfo = body.username;
    // 返回数据;
    ctx.body = {
        ok: 0,
        msg: '登录成功'
    }

})
router.post('/loginOut', (ctx, next) => {
    delete ctx.session.userinfo;
    ctx.body = {
        ok: 0,
        msg: '登出成功'
    }
})

router.post('/register', async (ctx, next) => {
    ctx.status = 200;
    const body = ctx.request.body;
    const username = body.query.username;
    let password = body.query.password;

    //生成salt的迭代次数
    const saltRounds = 10;

    // 随机生成盐值
    const salt = bcrypt.genSaltSync(saltRounds);

    // 获取hash值
    const hash = bcrypt.hashSync(password, salt);
    password = hash

    // 注册插入数据
    await insertUser(username, password);
    ctx.body = {
        ok: 0,
        msg: '注册成功'
    }
})
router.post('/loginToken', async (ctx, next) => {
    const { body } = ctx.request;
    console.log(body);
    
    const userinfo = body.query.username;
    ctx.body = {
        ok: 0,
        msg: '登录成功',
        user: userinfo,
        // 使用jwt签名一个令牌, 对某个东西进行hash编码
        token: jwt.sign( // 签名只是防篡改, jwt算法, 使用的是hmac和sha256 反篡改
            {
                data: userinfo, // 由于签名不是加密, 所以这里不能存放敏感数据
                exp: Math.floor(Date.now() / 1000) + 60 * 60, // 过期时间,  一分钟
            },
            secret
        )
    }
})
// jwtAuth({ secret }) 进行校验
router.get('/getLoginToken', jwtAuth({ secret }), async (ctx, next) => {
    const { body } = ctx.request;
    ctx.body = {
        ok: 0,
        msg: '获取数据成功',
        userinfo: ctx.state.user.data,
    }
})

router.get('/getUser', auth, (ctx, next) => {
    ctx.body = {
        ok: 0,
        msg: '获取用户成功',
        data: {
            userinfo: ctx.session.userinfo
        }
    }
})
module.exports = router