//引入express
const express = require('express')
//创建服务对象
const app = express()
//禁止服务器返回X-Powered-By,为了安全
app.disable('x-powered-by')
//使用内置中间件暴露资源，不访问路由直接写文件名 + 后缀也能看到页面
app.use(express.static(__dirname + '/public'))
//使用内置中间件用于解析POST请求的urlencoded参数
app.use(express.urlencoded({ extended: true }))
//引入db文件
let db = require('./db/db')
//引入用户模型对象
let users = require('./model/usersModel')

//在数据库连接成功后服务器才启动 ----- 只需要连接一次数据库即可
db(function (err) {
  if (err) {
    console.log(err);
  } else {
    //创建login路由 主要用来展示页面
    app.get('/login', (req, res) => {
      res.sendFile(__dirname + "/public/login.html")
    })

    //创建register路由 主要用来展示页面
    app.get('/register', (req, res) => {
      res.sendFile(__dirname + "/public/register.html")
    })

    //用于处理用户注册请求，包含了业务逻辑---业务路由
    app.post('/register', (req, res) => {
      //获取用户输入的数据
      let { name, nick_name, password, re_password } = req.body;
      //校验邮件的正则表达式
      const emailReg = /^[a-zA-Z0-9_]{4,20}@[a-zA-Z0-9]{2,10}\.com$/
      //校验昵称的正则表达式
      const nickNameReg = /[\u4e00-\u9fa5]/gm
      //校验密码的正则表达式
      const passwordReg = /^[a-zA-Z0-9_@#.+&]{6,20}$/
      //使用正则去校验
      if (!emailReg.test(email)) {
        res.send('邮箱填写错误')
      } else if (!nickNameReg.test(nick_name)) {
        res.send('昵称输入错误，请注意填写格式')
      } else if (!passwordReg.test(password)) {
        res.send('密码填写格式错误')
      } else {
        //去数据库查询该邮箱是否注册过
        users.findOne({email},function(err,data){
          if(data){
            //该邮箱已被注册，提示用户
            res.send('该邮箱已被注册')
          }else {
            //数据库没有该邮箱，可以写进数据库
            users.create({email,nick_name,password},function(err,data){
              if(data){
                res.send('注册成功')
              }else {
                res.send('您当前的网络不稳定，请稍后再试')
                console.log(err);
              }
            });
          }
        })
      }
    })


    //监听端口
    app.listen(3000, (err) => {
      if (!err) console.log('服务器启动成功！')
      else console.log(err)
    })
  }
})