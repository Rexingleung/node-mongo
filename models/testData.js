const mongodb = require('./db');
mongodb.once("connect", async () => {
    // 我们需要在这里才能拿到这个fruits的集合
    const col =  mongodb.col('fruits');
    try {
        // 全部删除
        // await col.deleteMany();

        //插入测试数据

        await col.insertMany([
            { name: "苹果1", price: 15, category: "水果" },
            { name: "苹果2", price: 25, category: "水果" },
            { name: "苹果3", price:35, category: "水果" },
            { name: "苹果4", price: 45, category: "水果" },
            { name: "苹果5", price: 55, category: "水果" },
            { name: "苹果6", price: 65, category: "水果" },
            { name: "苹果7", price: 75, category: "水果", stack: 100 },
            { name: "苹果8", price: 85, category: "水果", stack: 100 },
            { name: "苹果9", price: 95, category: "水果" }
        ])
        console.log('插入成功');
        
    } catch (error) {
        console.log('插入失败', error);
        throw error
        
        
    }
})

// 这里是拿不到这个fruits这个集合的, 因为nodejs是先执行同步代码, 再执行回调函数的, 当这里的testData.js文件执行的时候, 我们写的是同步代码, 当执行到mongodb.col('fruits')这里的时候, 我们上面引入的库里面的连接还没执行, 所以就会拿不到fruits这个库
//mongodb.col('fruits')