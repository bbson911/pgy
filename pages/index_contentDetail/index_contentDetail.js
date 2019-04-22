// pages/index_contentDetail/index_contentDetail.js

import api from "../../api/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    aprs: "",
    isIphoneX: "",
    name: "",
    article_img_path: "",
    options: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    app.globalData.cbUrl = app.getCurrentPageUrlWithArgs();
    console.log(app.globalData.cbUrl);
    this.setData({
      isIphoneX: app.globalData.isIphoneX
    })

    let _this = this;
    //console.log(options);
    if (options.id != '') {
      this.setData({ 
        url: api.getWebUrl() + "/Article/liteArticleInfo?article_id=" + options.id + '&aprs=' + options.aprs + '&isIphoneX=' + this.data.isIphoneX
      })
    } else {
      wx.navigateBack({ delta: 1 });
    }

    this.setData({
      options: options,
      id: options.id,
      aprs: options.aprs
    });
    wx.setStorageSync("shareid", this.data.id);
    wx.setStorageSync("shareaprs", this.data.aprs);
    
    //this.getProductByArticleId();

  },

  /**
   * 获取文章信息
   */
  getProductByArticleId: function () {
    let _this=this;
    //获取商品信息
    api.getProductByArticleId({
      article_id: this.data.id
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          name: res.data.data.name,
          article_img_path: res.data.data.article_img_path,
        });
      }
    }).catch((err) => {

    });
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
  onShareAppMessage: function (options) {
    let _this = this; console.log(this.data.article_img_path)
    console.log('/pages/index_contentDetail/index_contentDetail?id=' + this.data.id + '&aprs=' + this.data.aprs);

    api.createSpreadQRcode({
      aprs: _this.data.aprs,
      defaultUser: -1
    }).then((res) => {
      if (res.data.status == 200) {
        wx.setStorageSync("spread_id", res.data.data.id);
      }
    }).catch((err) => {

    });
    return {
      title: this.data.name,
      imageUrl: this.data.article_img_path,
      path: '/pages/index_contentDetail/index_contentDetail?id=' + this.data.id +'&aprs=' + this.data.aprs,
      success: function (res) {
        // 转发成功
        console.log("转发成功");
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})