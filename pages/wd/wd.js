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
    // wx.clearStorage();
  },
  onShow: function(args) {
    var data = this.data,
        anim,
        lastMsg;
    anim = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-in-out'
    });
    this.anim = anim;
    data.user = wx.getStorageSync('qaList') || [];
    lastMsg = data.user[data.user.length - 1];
    this.setData(data);
    this.setData({
      toView: 'toView' + (lastMsg ? lastMsg.id : 0)
    });
  },
  toastChange: function() {
    var _data = this.data;
    _data.toastHidden = true;
    this.setData(_data);
  },
  formSubmit: function(e) {
    var _this = this,
        q = e.detail.value.question,
        _data = _this.data,
        anim = this.anim;
    anim.scale(1.1, 1.1).step();
    anim.scale(1, 1).step();
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
    _data.animationData = anim.export();
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
        var d, lastMsg;
        if (res.statusCode === 200) {
          d = res.data;
          _data.hidden = true;
          lastMsg = _data.user[_data.user.length - 1];
          _data.user.push({
            id: lastMsg ? lastMsg.id + 1 : 1,
            question: "问：" + q,
            anwser: "答：" + (d.result.text || ''),
            url: d.result.url ? decodeURIComponent(d.result.url) : null
          });
          if (_data.user.length > 30) {
            _data.user = _data.user.slice(_data.user.length - 30);
          }
          wx.setStorageSync('qaList', _data.user);
          _this.setData(_data);
          _this.setData({
            toView: 'toView' + _data.user[_data.user.length - 1].id
          });
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