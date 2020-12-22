//引入express
const e = require('express')
const express = require('express')

//创建服务对象
const app = express()

//根路由
app.get('/', (request, response) => {
  let { name, pwd } = request.query
  response.send(`我是根路由下的${name}`)
})

//一级路由
app.get('/demo', (request, response) => {
  response.send('我是一级路由')
  //request.get() 获取请求头指定的key对应的value  ------可以获取Referer来做防盗链
  // console.log(request.get('Referer')) 
})

//二级路由
app.get('/demo/test', (request, response) => {
  //给浏览器一个响应
  // response.send('我是二级路由')
  //告诉浏览器下载一个文件，可以 传递相对路径
  // response.download(__dirname + '/public/vue.png')
  //给浏览器发送一个文件 备注： 必须传递绝对路径
  response.sendFile(__dirname + '/demo.html')
  //重新定向到一个新的地址（url）
  // response.redirect('http://www.baidu.com')
})

//参数路由
app.get('/demo/:id', function (request, response) {
  console.log(request.params);
  let { id } = request.params;
  response.send(`我是参数路由${id}`)
})

//解析POST请求请求体中所携带的urlencoded编码形式的参数 为一个对象，随后挂载到request对象上
app.use(express.urlencoded({ extended: true }))
//获取POST请求的参数
app.post('/', function (request, response) {
  // console.log(request.body);
  let { name } = request.body;
  response.send(`我是POST请求的页面的${name}参数`)
})

//监听服务器端口
app.listen(3000, (err) => {
  if (!err) console.log('服务器启动成功！')
  else console.log(err);
})