// pages/location/location.js

import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotCity:[],
    allCity:[],
    toView: '#',
    keywords:"",
    searchShow:false,
    searchList:[],
    btuBottom: "70rpx",
  },

  regionSelected:function(e){
    let _this=this;
    console.log(e);
    wx.showLoading({
      title: '加载中',
    })
    api.selected({
      selected: e.currentTarget.dataset.id
    }).then((res)=>{
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      })
    }).catch((err)=>{

    })
  },

  regionSearch:function(){
    let _this=this;
    api.regionSearch({
      keywords: _this.data.keywords
    }).then((res)=>{
      if(res.data.status==200){
        _this.setData({
          searchList: res.data.data
        })
      }

    }).catch((err)=>{
      
    })
  },

  searchInput:function(e){
    console.log(e.detail.value);
    this.setData({
      keywords:e.detail.value
    });
    if(this.data.keywords){
      this.setData({
        searchShow:true
      })
    }else{
      this.setData({
        searchShow: false
      })
    }
  },

  choiceWordindex: function (event) {
    let wordindex = event.currentTarget.dataset.wordindex;
    this.setData({
      toView: wordindex,
    });
    console.log(this.data.toView);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    if (app.globalData.isIphoneX) {
      this.setData({
        btuBottom: '120rpx',
      });
    }

    let _this=this;
    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      api.hotCity({}).then((res) => {
        if (res.data.status == 200) {
          _this.setData({
            hotCity: res.data.data
          })
        }
      }).catch((err) => {

      })
      api.regionMore({}).then((res) => {
        if (res.data.status == 200) {
          _this.setData({
            allCity: res.data.data
          })
        }
      }).catch((err) => {

      })
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
  
  }
})