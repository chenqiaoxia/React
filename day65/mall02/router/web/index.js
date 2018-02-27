// 在app.js中需要设定一系列开发所需的属性
var express = require('express');
var mysql = require('mysql');
var cryptoMd5 = require('../../utils/crypto_md5.js')
var db = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'mall'
});
module.exports = function(){
	var router = express.Router();
	router.get('/',(req,res)=>{
		// 根据给定的sql，获取到所有的商品
		var sql = "select * from goods";
		db.query(sql,(error,data)=>{
			if(error){
				res.rend('读取有误');
			}else{
				if(data.length==0){
				}else{
					// console.log(data);
					res.render('./web/index.ejs',{goods:data});
				}
			}
		});
	});
	router.get('/order',function(req,res){
		// 根据给定的sql，获取到所有的商品
		var act = req.query.act;
		var sql = "select * from goods order by price " + act;
		db.query(sql,(error,data)=>{
			if(error){
				res.rend('读取有误');
			}else{
				if(data.length==0){
				}else{
					// console.log(data);
					res.render('./web/index.ejs',{goods:data});
				}
			}
		});
	});
	// 关于用户管理的路由配置
	router.get('/user',(req,res)=>{
		res.render('./web/user.ejs',{});
	});
	// 用于实现用户登录请求
	router.post('/user/login',(req,res)=>{
		var account = req.body.account;
		var pwd = req.body.pwd;
		pwd = cryptoMd5(pwd);
		console.log('post请求数据：',req.body);
		// 根据读取到用户名以及密码，执行sql查询语句
		var sql = "select * from user_info where account= '"+account+"' and password='"+pwd+"'";
		db.query(sql,(error,data)=>{
			if(error){
				console.log('1');
				res.send('sql语句有误');
			}else{
				console.log('2');
				if(data.length==0){
					res.send('用户名or密码有误');
				}else{
					console.log('3');
					// res.send('用户登录成功');
					// res.redirect('/');
					var json = {resultCode:200,account:account};
					res.send(json);
				}
			}
		});
	});
	router.post('/user/regist',(req,res)=>{
		var account = req.body.account;
		var pwd = req.body.pwd;
		var confirm_pwd = req.body.confirm_pwd;
		// 将这个用户名以及密码插入到user_info表中
		// 直接将密码写入到数据库中，非常不安全 --> 变得相对安全 --> 加密 --> 将一串可识别的字符串转为基本无法识别的字符串
		pwd = cryptoMd5(pwd);
		// 书写sql语句
		var sql = `insert into user_info (account,password) values ('${account}','${pwd}')`;
		db.query(sql,(error,data)=>{
			if(error){
				res.send('注册有误');
			}else{
				res.redirect('/user');
			}
		});
	});
	return router;
}