// pages/attention_detail/attention_detail.js
import api from "../../api/api.js"
var days = [{ id: 1, name: "所有收益" }, { id: 2, name: "红包" }, { id: 3, name: "收益" }, { id: 0, name: "全部" }];
var val = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days: days,
    selectData: "",
    index: "0",
    modalFlag: "none",
    spread_id:"",
    attentionDetailList:[],
    btuBottom: "",
    btuHeight: "920rpx",
    
  },

  bindChange: function (e) {
    val = e.detail.value
    console.log(e);
  },
  selectTap: function (e) {
    let _this=this;
    this.setData({
      index: val,
      selectData: days[val],
      modalFlag: 'none'
    })
    // this.getTimeDetail(_this.data.spread_id,days[val].id);
    this.getTimeDetail(_this.data.spread_id,0);
  },
  showSelect: function (e) {
    this.setData({
      modalFlag: 'block'
    })
  },
  selectClose: function (e) {
    this.setData({
      modalFlag: 'none'
    })
  },
  naviGetIndex: function () {
    wx.navigateTo({
      url: '../../pages/person_interest/person_interest',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    if (app.globalData.isIphoneX) {
      this.setData({
        btuBottom: '50rpx',
        btuHeight: '1160rpx'
      });
    }

    let _this=this;
    this.setData({
      spread_id: options.spread_id,
    })
    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      _this.getTimeDetail(options.spread_id, 0);
    }).catch((err) => {

    })
    
  },
  getTimeDetail: function (spread_id,op){
    let _this = this;
    api.getTimeDetail({
      spread_id: Number(spread_id),
      page: 1,
      pagesize: 10,
      op:op
    }).then((res) => {
      if (res.data.status == 200) {
        _this.attentionDetailList = res.data.data.data;
        _this.attentionDetail = res.data.data;
        _this.setData({
          attentionDetailList: _this.attentionDetailList,
          name:_this.attentionDetail.name,
          sum_account: _this.attentionDetail.sum_account,
          count: _this.attentionDetail.count,
          showNums: _this.attentionDetail.showNums,
          img_path: _this.attentionDetail.img_path,
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