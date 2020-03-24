// 一定是异步函数
const vip = require('../models/vip');

let vipCourses;

module.exports = async (ctx, next) => {
    // ctx.state全局通信的方式, 高层级传参方式
    
    if(!vipCourses) {
        vipCourses =  await vip.find();
    }
    ctx.state.vipCourses =  await vip.find();
    // 下一步
    await next()
}