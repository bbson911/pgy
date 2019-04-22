// pages/person_interest/person_interest.js
import api from "../../api/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    api.earnings({
    }).then((res) => {
      if (res.data.status == 200) {
        _this.profitList = res.data.data;
        _this.setData({
          profitList: _this.profitList,
          waitProfit: _this.profitList.total.waitProfit,
          today_profit: _this.profitList.today.profit,
          today_orderCount: _this.profitList.today.orderCount,
          total_profit: _this.profitList.total.profit,
          total_orderCount: _this.profitList.total.orderCount,
        })
      }
    }).catch((err) => {

    });
  },
  
  interestSearch: function() {
    wx.navigateTo({
      url: '../../pages/person_incomeList/person_incomeList',
    })
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