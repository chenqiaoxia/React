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
		var sql = "select * from goods limit 0,10";
		db.query(sql,(error,data)=>{
			if(error){
				res.rend('读取有误');
			}else{
				if(data.length==0){
				}else{
					// console.log(data);
					res.send(data);
				}
			}
		});
	});
	router.get('/detail',(req,res)=>{
		var id = req.query.id;
		var sql = `select * from xx where id=${id}`;
		var str = '返回的内容是' + id;
		res.send(str);
	});
	return router;
}