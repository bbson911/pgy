// pages/red_wars/red_wars.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalFlag1: "none",
  
  },
  click_showRed: function (e) {
    // console.log("aaa");
    this.setData({
      modalFlag1: 'block'
    })
  },
  // 抢下一个红包
  naviToIndex: function () {
    wx.navigateTo({
      url: '../../pages/person_redWars/person_redWars',
    })
    this.setData({
      modalFlag1: 'none'
    })
  },
  // 炫耀一个
  naviToIndexshow: function () {
    wx.navigateTo({
      url: '../../pages/index_contentShare/index_contentShare',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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