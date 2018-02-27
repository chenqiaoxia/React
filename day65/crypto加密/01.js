var str = 'admin';
var util = require('./util.js');
// // node中提供了一个用于加密的模块
// var crypto = require('crypto');
// // 设定加密所采用加密方式  md5
// var md5 = crypto.createHash('md5');
// md5.update(str); // 其中str就是要想实现加密处理的文本内容
// var result = md5.digest('hex');
// console.log(result);
console.log(util(str));
