// 在app.js中需要设定一系列开发所需的属性
var express = require('express');
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');
var db = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'mall'
});
module.exports = function(){
	var router = express.Router();
	// 使用路由对象中的use写法，并且没有书写路径参数
	// 就意味着不管哪一个路径被请求了，这个监听都会发生
	router.use(function(req,res,next){
		console.log(req.url);
		console.log(req.session['account']);
		if(req.session['account']==undefined&&req.url!='/login'){
			// 说明此时还未登录过
			res.redirect('/admin/login');
		}else{
			next();
		}
	});
	router.get('/',function(req,res){
		console.log(req.session['account']);
		res.render('./admin/index.ejs',{name:req.session['account']});
	});
	// 登录相关的操作
	router.use('/login',require('./login.js')());
	// 商品管理页面
	router.use('/goods_manage',require('./goodmanage.js')());
	return router;
}