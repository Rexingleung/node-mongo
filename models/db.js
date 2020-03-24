const conf = require('./conf')

const MongoClient = require('mongodb').MongoClient;

const EeventEmitter = require('events').EventEmitter

class Mongodb {
    constructor(conf) {
        // 保存conf, 为了外面使用到conf的时候, 可以通过this.conf拿到这个conf
        this.conf = conf;
        this.emitter = new EeventEmitter()
        // 连接数据库
        this.client = new MongoClient(conf.url, { useNewUrlParser: true })
        // 自动重连机制
        this.client.connect(err => {
            if (err) {
                throw err;
            } else {
                console.log('连接数据库成功');
                this.emitter.emit('connect')

            }
        })
    }
    // 获取集合方法
    col(colName, dbName = this.conf.dbName) {
        return this.client.db(dbName).collection(colName)
    }
    // 监听事件的方法
    once(event, cb) {
        this.emitter.once(event, cb)
    }
}



module.exports = new Mongodb(conf);
