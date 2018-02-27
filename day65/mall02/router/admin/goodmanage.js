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
		// 借助数据库，读取产品表中的所有数据
		var sql = 'select * from goods limit 0,10';
		db.query(sql,(error,data)=>{
			if(error){
				res.send('数据表读取有误');
			}else{
				res.render('./admin/good_manager.ejs',{name:req.session['account'],goods:data});
			}
		});
	});
	router.get('/del',function(req,res){
		// 获取到所要删除的商品的id值
		var id = req.query.id;
		var sql = "delete from goods where id=" + id;
		db.query(sql,(error)=>{
			if(error){
				res.send('删除异常');
			}else{
				res.redirect('/admin/goods_manage');
			}
		});
	});
	router.get('/update',function(req,res){
		// 进入到一个修改页面 --> 这个页面会将所要修改的内容先展示一下
		var id = req.query.id;
		var sql = "select * from goods where id=" + id;
		console.log('get = ',id);
		db.query(sql,(error,data)=>{
			if(error){
				res.send('修改异常');
			}else{
				if(data.length==0){
					res.send('修改异常');
				}else{
					res.render('./admin/update.ejs',{name:req.session['account'],good:data[0],goodid:id});
				}
			}
		});
		
	});
	router.post('/update',(req,res)=>{
		// 对于基础数据的修改
		var id = req.body.goodid;
		console.log('goods_manage update = ',req.body);
		var title = req.body.title;
		var price = req.body.price;
		var comment_num = req.body.comment_num;
		var shop = req.body.shop;
		var oldName = req.files[0].path;
		// 通过path这个模块，获取到该文件对应的后缀名
		var ext = path.parse(req.files[0].originalname).ext;
		var newName = oldName + ext;
		// 先根据给定的id，查找到对应的图片存放路径
		var delSql = "select * from goods where id=" + id;
		db.query(delSql,(error,data)=>{
			if(error){
				res.send('修改有误');
			}else{
				if(data.length==0){
					res.send('修改有误');
				}else{
					// 获取到了图片的名称
					var imgName = data[0].imgsrc;
					var imgPath = req.files[0].destination + imgName;
					// 根据给定的资源路径进行删除 --> 文件相关操作
					fs.unlink(imgPath,(error)=>{
						if(error){
							res.send('删除异常');
						}else{
							var sql = "update goods set title='"+title+"',price="+price+",comment_num="+comment_num+",shop='"+shop+"',imgsrc='"+(req.files[0].filename+ext)+"' where id=" + id;
							fs.rename(oldName,newName,(error)=>{
								if(error){
									res.send('fail');
								}else{
									db.query(sql,()=>{
										res.redirect('/admin/goods_manage');
									});
								}
							});
						}
					});
				}
			}
		});
		// // 对于所需图片保存位置的存储
		// 对于所需图片的上传 --> 保存到某一个指定的文件夹下
	});
	// 商品添加的实现
	router.get('/add',(req,res)=>{
		res.render('./admin/add.ejs',{name:req.session['account']});
	});
	router.post('/add',(req,res)=>{
		var title = req.body.title;
		var price = req.body.price;
		var comment_num = req.body.comment_num;
		if(comment_num>10000){
			comment_num = comment_num/10000 + '万'; 
		}
		var shop = req.body.shop;
		var brand = req.body.brand;
		if(req.files.length==0){
			var defaultSrc = "default.png";
			var sql = "insert into goods (title,price,comment_num,shop,brands,imgsrc) values ('"+title+"',"+price+","+comment_num+",'"+shop+"','"+brand+"','"+defaultSrc+"')";
			db.query(sql,()=>{
				res.redirect('/admin/goods_manage');
			});
		}else{
			var oldName = req.files[0].path;
			// 通过path这个模块，获取到该文件对应的后缀名
			var ext = path.parse(req.files[0].originalname).ext;
			var newName = oldName + ext;
			fs.rename(oldName,newName,(error)=>{
				if(error){
					res.send('fail');
				}else{
					var sql = "insert into goods (title,price,comment_num,shop,brands,imgsrc) values ('"+title+"',"+price+",'"+comment_num+"','"+shop+"','"+brand+"','"+(req.files[0].filename+ext)+"')";
					db.query(sql,()=>{
						res.redirect('/admin/goods_manage');
					});
				}
				});
			}
	});
	return router;
}