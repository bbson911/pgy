// pages/person_pwdFirst/person_pwdFirst.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:"",
    pwd:""
  },
  inputPwd:function(e){
    wx.setStorageSync('oldpwd', e.detail.value);
    this.setData({
      pwd:e.detail.value
    })
  },
  
  goChangeMobile:function(event){
    if( this.data.pwd.length >= 8){
      if (wx.getStorageSync('oldpwd')) {
        wx.navigateTo({
          url: '../../pages/person_pwdNext/person_pwdNext?type=' + event.currentTarget.dataset.type,
        })
      }      
    }else{
      wx.showModal({
        title: '聚焦蒲公英',
        content: '8-18位，英文或数字组合',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    api.userCenter({

    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          mobile: res.data.data.mobile
        })
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