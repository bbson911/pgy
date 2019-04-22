// pages/person_walletWithdrawRecords/person_walletWithdrawRecords.js
import api from "../../api/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdrawList: [],
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: true,
    scrollTop: "",
    nowDate: 0, //当前时间
    nodataStatus: false, //加载中没有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    this.getWithdrawRecord();
  },

  /**
   * 获取订单列表
   */
  getWithdrawRecord: function (event) {
    var _this = this;

    api.withdrawRecord({
      page: _this.data.page,
      pagesize: 10,
    }).then((res) => {
      //console.log(res.data.data);
      if (res.data.status == 200) {
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            withdrawList: res.data.data.data
          });
          //console.log(_this.data.withdrawList);
        } else if (_this.data.page == 1 && res.data.data.data.length == 0) {
          //console.log("没有数据");
          _this.setData({
            nodataStatus: true
          });
        } else if (1 < _this.data.page && _this.data.page <= _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            withdrawList: _this.data.withdrawList.concat(res.data.data.data)
          });
        } else if (_this.data.page != 1 && _this.data.page > _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            nodataStatus: true
          });
        }

        _this.setData({
          pageCount: res.data.data.page_count,
          loadingStatus: false
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