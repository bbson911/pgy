// pages/attention/attention.js
import api from "../../api/api.js"
var days = [{ id: 0, name: "全部" },{ id: 1, name: "最近七天" }, { id: 2, name: "最近一个月" }, { id: 3, name: "最近三个月" }];
var val = 0;
Page({
  /**
   * 页面的初始数据
   */  
  data: {
    days: days,
    selectData: "",
    index: "0",
    daysId:0,
    modalFlag: "none",
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus:true,
    scrollTop: "",
    attentionList:[],
    nodataStatus: false, //加载中没有更多数据
    btnBottom: "",
  },
  bindChange: function (e) {
    val = e.detail.value
    console.log(e);
  },
  selectTap: function (e) {
    this.data.daysId = days[val].id;
    this.setData({
      scrollTop: 0,
      page: 1,
      attentionList: []
    });
    this.setData({
      index: val,
      selectData: days[val],
      modalFlag: 'none',
    })

    this.getTimeLists();
  },
  showSelect: function (e) {
    this.setData({
      modalFlag: 'block'
    })
  },
  selectClose:function(e){
    this.setData({
      modalFlag: 'none'
    })
  },
  searchAttention:function(e){
    wx.navigateTo({
      url: '../../pages/attention_search/attention_search',
    })
  },
  goIndex:function(e){
    wx.navigateTo({
      url: '../../pages/index/index',
    })
  },
  naviToIndex: function (e) {
    var id = e.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../../pages/attention_detail/attention_detail?spread_id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 滚动加载
  lower: function () {
    console.log(this.data.page, this.data.pageCount);
    if (!this.data.loadingStatus && this.data.page <= this.data.pageCount) {
      this.data.page++;
      this.setData({
        loadingStatus: true,
        page: this.data.page
      });
      this.getTimeLists();
    }
  },
  onLoad: function () {
    let app = getApp();
    if (app.globalData.isIphoneX){
      this.setData({
          btnBottom: '50rpx'
      });
    }
    
    let _this = this;
    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      if (res.data.status == 200) {
        _this.getTimeLists(0);
      } else if (res.data.status == 100017) {
        console.log("token 失效");
        app.login(function () {
          _this.getTimeLists(0);
        });
      } else {

      }
    }).catch((err) => {

    })



  },
  getTimeLists: function () {
    // 列表数据接口
    let _this = this;
    api.getTimeList({
      op: _this.data.daysId,
      page: _this.data.page,
      pagesize: 10
    }).then((res) => {
      if (res.data.status == 200) {
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            attentionList: res.data.data.data
          });
        } else if (_this.data.page == 1 && res.data.data.data.length == 0) {
          //console.log("没有数据");
          _this.setData({
            nodataStatus: true
          });
        } else if (1 < _this.data.page && _this.data.page <= _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            attentionList: _this.data.attentionList.concat(res.data.data.data)
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