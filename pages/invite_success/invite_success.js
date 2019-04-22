// pages/invite_success/invite_success.js

import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync("is_register"));
    
    this.setData({
      url: api.getWebUrl() + '/Share/liteshare' + '?invite_code=' + options.invite_code + '&is_register=' + wx.getStorageSync("is_register")
      //url: this.data.url + '?invite_code=' + '4e958eee' + '&is_register='
    });
    // wx.showToast({
    //   title: this.data.url,
    // });
    console.log(this.data.url);
    wx.setStorageSync("invite_code", options.invite_code);
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
  
  }
})