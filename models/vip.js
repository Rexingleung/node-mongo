const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name: String,
    url: String,
    poster: String,
    icon: String,
    descrition: String,
    cooperation: [String]
});

const model = mongoose.model('vip', schema);

// 测试数据
async function testData() {
    await model.deleteMany();
    await model.insertMany([
        {
            name: "test1",
            url: 'www.baidu.com',
            poster: 'https://static.easyicon.net/preview/123/1232474.gif',
            icon: 'https://static.easyicon.net/preview/123/1232474.gif',
            descrition: '文字描述',
            cooperation: [
                'https://static.easyicon.net/preview/118/1180657.gif',
                'https://static.easyicon.net/preview/119/1195608.gif'
            ]
        },
        {
            name: "test2",
            url: 'www.baidu.com',
            poster: 'https://static.easyicon.net/preview/123/1232474.gif',
            icon: 'https://static.easyicon.net/preview/123/1232474.gif',
            descrition: '文字描述',
            cooperation: [
                'https://static.easyicon.net/preview/118/1180657.gif',
                'https://static.easyicon.net/preview/119/1195608.gif'
            ]
        },
        {
            name: "test3",
            url: 'www.baidu.com',
            poster: 'https://static.easyicon.net/preview/123/1232474.gif',
            icon: 'https://static.easyicon.net/preview/123/1232474.gif',
            descrition: '文字描述',
            cooperation: [
                'https://static.easyicon.net/preview/118/1180657.gif',
                'https://static.easyicon.net/preview/119/1195608.gif'
            ]
        },

    ])
}
testData();
module.exports = model;