Page({
  data:{
    datas:[]
  },
  onLoad:function(){
    this.getData();
  },
  getData:function(){
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8080/data',
      success:function(res){
        console.log(res.data);
        that.setData({
          datas: res.data
        });
      }
    })
  },
  showDetail:function(e){
    // 获取到当前被点击到的那一行数据的id
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  }
});