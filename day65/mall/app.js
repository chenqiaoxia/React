// 在app.js中需要设定一系列开发所需的属性
var express = require('express');
// 获取到ejs模块
var ejs = require('ejs');
// 获取到static模块 --> 适用于读取静态资源用的
var expressStatic = require('express-static');
// 获取到所需的模块，用于实现post请求参数的获取
var bodyParser = require('body-parser');
// 获取cookie-parser 模块，用于实现cookie数据的存储
var cookieParser = require('cookie-parser');
// 获取cookie-session 模块  用于实现sessin数据的存储
var cookieSession = require('cookie-session');
// 获取multer模块   用于实现图片上传
var multer = require('multer');
// 设定图片存储位置
var multerObj = multer({ dest: './static/uploads/' }); 
var app = express();
// 设定ejs模板引擎对应的一系列基本属性
app.set('view engine','ejs');
app.set('views','./view');
app.use(bodyParser());
app.use(cookieParser());
app.use(multerObj.any());
var arr = [];
for(var i=0;i<100000;i++){
	arr.push(Math.random()*i + 'a');
}
app.use(cookieSession({
	keys:arr,
	maxAge:3600*1000
}));
// 使用express中对应的router，实现router路由的基础配置
app.use('/admin',require('./router/admin/index.js')());
app.use('/',require('./router/web/index.js')());
app.listen(8080);
app.use(expressStatic('./static'));