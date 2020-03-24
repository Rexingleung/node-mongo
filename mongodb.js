// 客户端
const MongoClient = require('mongodb').MongoClient;

// 连接URL
const url = 'mongodb://localhost:27017';

// 数据库名
const dbName = 'test';

(async function(){
    // 0. 创建客户端
    // 第二个参数是配置项
    const client = new MongoClient(url, { useNewUrlParser: true });
    try {
        // 1. 连接数据库, 返回Promise
        await client.connect();
        console.log('连接成功');

        // 2. 获取数据库
        const db = client.db(dbName);

        // 3. 获取集合;
        const fruitsCollect = db.collection('fruits');

        // 4. 插入文档, 返回Promise, 
        // let r = await fruitsCollect.insertOne({ name: "芒果", price: 20.0 })
        // let r2 = await fruitsCollect.insertOne({ name: "苹果", price: 23.1 })
        // console.log('插入成功', r.result);
        // console.log('插入成功', r2.result);

        // 5. 查询文档
        let r = await fruitsCollect.findOne();
        console.log("查询结果", r);

        // 6. 更新文档
        r = await fruitsCollect.updateOne({ name: '芒果'}, {$set:{name:  "大芒果"}});
        console.log('更新成功', r.result);

        // // 7. 删除文档
        r = await fruitsCollect.deleteOne({name: '大芒果'});
        console.log('删除成功', r.result);
        
    }catch (err){
        console.log(err);
        
    }
})()