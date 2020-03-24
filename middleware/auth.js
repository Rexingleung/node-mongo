// 认证用户
module.exports = async (ctx, next) => {
    console.log(ctx.session,'ctx.session.userinfo123');
    
    if(!ctx.session.userinfo) {
        ctx.status = 200; 
        // 未登录
        ctx.body = {
            ok: 0,
            msg: '用户未登录'
        }
    }else {
        next()
    }
}