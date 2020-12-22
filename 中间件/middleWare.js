const express = require('express')
const app = express()

//第一种使用应用级（全局）中间件-------所有请求的第一扇门
/* app.use((request,response,next) => {
  //图片防盗链
  //判断是否有Referer请求带来的数据
  if(request.get('Referer')){
    let minReferer = request.get('Referer').split('/')[2]
    if(minReferer == '127.0.0.1:5500'){
        //访问的地址对应后通行
        next();
    }else {
        //发生了盗链，展示提示
        response.sendFile(__dirname + '/public/err.png')
    }
  }else {
      //如果没有Referer则放行
      next();
  }
}) */

//【第二种】使用全局中间件的方式 ------更见灵活，不是第一扇们，可以在任何有需要的地方使用
function guardPic(request, response, next) {
    //防盗链
    if (request.get('Referer')) {
        let minReferer = request.get('Referer').split('/')[2]
        if (minReferer == '127.0.0.1:5500') {
            //访问的地址对应后通行
            next();
        } else {
            //发生了盗链，展示提示
            response.sendFile(__dirname + '/public/err.png')
        }
    } else {
        //如果没有Referer则放行
        next();
    }
}

//express 内置中间件 -------解析POST请求携带的参数并挂载在request对象上
app.use(express.urlencoded({extended: true}))

//express.static 使用内置中间件去暴露静态资源 ----一次性把你所指定的文件夹内的资源全部交出去
app.use(express.static(__dirname + '/public'))

app.get('/', function (request, response) {
    response.send('我是根路由')
})

//一级路由,给浏览器发送图片-----可以使用第二种全局中间件  guardPic
app.get('/picture', guardPic, function (request, response) {
    response.sendFile(__dirname + "/public/vue.png")
})

//一级路由 【POST请求】
app.post('/',(request,response) => {
  //获取post请求携带的参数
  console.log(request.body);
  let {name,age} = request.body;
  response.send(`我是POST请求参数：${name}、${age}`)
})

app.listen(3000, function (err) {
    if (err) console.log(err)
    else console.log('服务器启动成功')
})