var app = getApp(),
    api = 'https://op.juhe.cn/robot/index',
    appKey = 'd3b7f81ac8efa513bcb95639ac9dee99';

Page({
  data:{
    title:"你来提问，我来回答",
    hidden: true,
    toastHidden: true,
    errMsg: '',
    user: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // console.log(options);
  },
  onShow: function(args) {
    var data = this.data;
    data.user = wx.getStorageSync('qaList') || [];
    this.setData(data);
  },
  toastChange: function() {
    var _data = this.data;
    _data.toastHidden = true;
    this.setData(_data);
  },
  formSubmit: function(e) {
    var _this = this,
        q = e.detail.value.question,
        _data = _this.data;
    if (!q) {
      _data.toastHidden = false;
      _data.errMsg = '请输入问题';
      _this.setData(_data);
      return false;
    }
    _data.entry = q;
    _data.hidden = true;
    _data.toastHidden = true;
    _data.errMsg = '';
    _this.setData(_data);
    wx.request({
      url: api,
      data: {
        key: appKey,
        info: q,
        dtype: 'json'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        var d;
        if (res.statusCode === 200) {
          d = res.data;
          _data.hidden = true;
          _data.user.unshift({
            question: "问：" + q,
            anwser: "答：" + (d.result.text || '')
          });
          if (_data.user.length > 30) {
            _data.user.length = 30;
          }
          wx.setStorageSync('qaList', _data.user);
          _this.setData(_data);
        } else {
          _data.toastHidden = false;
          _data.errMsg = res.errMsg;
          _this.setData(_data);
        }
      }
    });
  },
  /*
  inputFocus: function() {
    this.setData({
      user: {
        question: '',
        anwser: ''
      }
    });
  },
  */
  formReset: function() {
    var data = this.data;
    data.entry = '';
    this.setData(data);
  }
})