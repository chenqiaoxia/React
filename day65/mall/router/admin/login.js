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
	router.get('/',function(req,res){
		res.render('./admin/login.ejs',{});
	});
	router.post('/',function(req,res){
		// 获取到传递过来的用户名以及面
		var accout = req.body.accout;
		var pwd = req.body.pwd;
		// 使用这个账号跟密码跟管理员表中的数据进行比对
		var sql = "select * from admin_info where accout= '"+accout+"' and password='"+pwd+"'";
		console.log(sql);
		// 执行这一条sql语句 --> 需要连接指定的数据库
		db.query(sql,(error,data)=>{
			if(error){
				var state = {
					value:'账号or密码不存在'
				};
				res.render('./admin/loginFail.ejs',{state:state});
			}else{
				// 对于返回得到的data，也要进行对应的判断--> 要根据data的长度进行
				if(data.length==0){
					// 表明登录失败了
					var state = {
						value:'账号or密码输入有误'
					};
					res.render('./admin/loginFail.ejs',{state:state});
				}else{
					// 表明验证成功了
					// 设定一个session去保存登录成功后的用户名
					req.session['account'] = accout;
					res.redirect('/admin/');
				}
			}
		});
	});
	return router;
}