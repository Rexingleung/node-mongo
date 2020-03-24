const hbs = require('koa-hbs');
const moment = require('moment');

//第三方的helps的引用, 按需引用, 前提是已经安装好了第三方的helpers
// const helpers = require('helpers');
// helpers.comparison({ handlebars: hbs.handlebars });

// 日期格式化
hbs.registerHelper("data", (data, pattern) => {
    try {
        return moment(data).format(pattern);
    } catch (error) {
        return error
    }
})