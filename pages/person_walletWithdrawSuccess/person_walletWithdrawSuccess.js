// pages/person_walletWithdrawSuccess/person_walletWithdrawSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:"",
    bankcard:"",
    getaccoutTime:"",
    bankcardname:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    var Y = date.getFullYear() + '.';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var times= Y + M + D;
    this.setData({
      account:options.account,
      bankcard:options.bankcard,
      bankcardname: options.bankcardname,
      getaccoutTime: times
    })
 
  },
  goIndex:function(){
    wx.navigateTo({
      url: '../../pages/index/index',
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})