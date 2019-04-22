// pages/person_walletWithdraw/person_walletWithdraw.js
import api from "../../api/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btuBottom: "50rpx",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    if (app.globalData.isIphoneX) {
      this.setData({
        btuBottom: '100rpx',
      });
    }
    
    let _this = this;
    console.log(options);
    this.setData({
      id: options.id,
    })
    api.withdrawDetail({
      id: Number(options.id)
    }).then((res) => {
      if (res.data.status == 200) {
        _this.withdrawDetail = res.data.data;
        _this.setData({
          banknumber: _this.withdrawDetail.banknumber,
          account: _this.withdrawDetail.account,
          poundage: _this.withdrawDetail.poundage,
          add_time: _this.withdrawDetail.add_time,
          current_balance: _this.withdrawDetail.current_balance,
          order_number: _this.withdrawDetail.order_number,
          withdraw_no: _this.withdrawDetail.withdraw_no,
          remark: _this.withdrawDetail.remark,
          okOrfail_time: _this.withdrawDetail.okOrfail_time
        });
      }
    }).catch((err) => { });
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