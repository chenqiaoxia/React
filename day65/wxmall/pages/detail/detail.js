Page({
  data:{
    num:0
  },
  onLoad:function(options){
    var that = this;
    wx.request({
      url: "http://127.0.0.1:8080/data/detail?id=" + options.id,
      success:function(res){
        console.log(res.data);
        that.setData({
          num: res.data
        });
      }
    })
  }
});