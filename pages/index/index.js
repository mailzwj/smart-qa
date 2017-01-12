//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    btnText: '进入问答',
    appInfo: {
      logoUrl: '../../images/logo.jpg',
      appName: '你问我答'
    }
  },
  enterAskAndAnwser: function() {
    wx.navigateTo({
      url: '../wd/wd'
    })
  },
  onLoad: function () {
    // console.log('onLoad')
  }
})
