const mongo = require('./models/db');
// const testData = require('./models/testData');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

// 创建application/json 解析器
var jsonParser = bodyParser.json()
// 创建 application/x-www-form-urlencoded 解析器
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const express = require('express');

const app = express();
app.get('/fruit-market', async (req, res) => {
    res.sendFile(path.resolve('./fruit-market.html'))
})
// 分页查询, 果蔬的数据
app.get('/api/list', async (req, res) => {
    // 分页数据
    // 拿出页码
    const { page } = req.query; // 这个query就是前端的参数
    try {
        let col = mongo.col('fruits')
        const fruits = await col.find().skip((page - 1) * 10).limit(10).toArray();

        // 查询总条数
        const total = await col.find().count();
        res.json({ ok: 1, data: { fruits, pagination: { total, page } } });
    } catch (error) {

    }
})

app.get('/', async (req, res) => {
    fs.readFile(path.resolve(__dirname, './index.html'), (err, data) => {
        if (err) {
            throw err
        }
        res.statusCode = 200;
        res.end(data)
    })
})

app.post('/api/update', jsonParser, async (req, res) => {
    // console.log(req.body);
    const { query } = req.body
    let col = mongo.col('fruits')
    col.insertOne(query)
    // try {
    //     let col = mongo.col('fruits')
    //     // col.insertOne({})
    //     res.end({ok: 1, msg: "插入成功"})
    // } catch (error) {
    //     if(error) throw error
    //     res.end({err: 0, msg: '插入失败', data: error})
    // }

    res.statusCode = 200;
    res.send({ok: 1, msg: "更新成功", data: {query}})
})
app.listen(3000)
