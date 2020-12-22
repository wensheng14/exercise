//引入mongoose
let mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

let DBNAME = 'ChengJiang';
let PORT = 27017;
let IP = 'localhost'

function connectMongo(callBack){
  //连接数据库
  mongoose.connect(`1model://${IP}:${PORT}/${DBNAME}`, {
    useNewUrlParser: true,  //使用了一个新的url解析器，主要用来解决一些安全问题
    useUnifiedTopology: true,   //使用了一个统一的新的拓扑解析器
  })

  //绑定数据库连接监听
  mongoose.connection.on('open',(err) => {
    if(err){
      console.log('数据库连接失败',err)
      callBack('connect failed');
    }else {
      console.log('数据库连接成功')
      callBack();
    }
  })
}

//暴露数据库连接监听
module.exports = connectMongo;
