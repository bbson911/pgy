// pages/icome_account/icome_account.js
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
    this.setData({
      id: Number(options.id),
    })
    api.earningBillDetail({
      id: options.id
    }).then((res) => {
      if (res.data.status == 200) {
        _this.earningBillDetail = res.data.data;
        _this.setData({
          product_name: _this.earningBillDetail.product_name,
          add_time: _this.earningBillDetail.add_time,
          title: _this.earningBillDetail.title,
          order_number: _this.earningBillDetail.order_number,
          unlock_time: _this.earningBillDetail.unlock_time,
          account: _this.earningBillDetail.account


        });
      }
    }).catch((err) => {

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