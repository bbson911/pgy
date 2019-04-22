// pages/attention_search/attention_search.js
import api from "../../api/api.js"
Page({

  data: {
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: false,
    scrollTop: "",
    attentionList: [],
    searchValue:"",
    nodataStatus: false, //加载中没有更多数据
  },
  naviToIndex: function (e) {
    var id = e.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../../pages/attention_detail/attention_detail?spread_id=' + id,
    })
  },
  clearSearch:function(e){
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取inputsearch值
  searchValue:function(e){
    this.setData({
      searchValue: e.detail.value
    })
    /* if (this.data.searchValue==''){
      this.setData({
        attentionList: [],
        page: 1,
      })
    } */
   },
  showResult:function(e){
    if (this.data.searchValue != '') {
      this.setData({
        scrollTop: 0,
        page: 1,
        attentionList: [],
        loadingStatus: true,
        nodataStatus: false
      });
      this.getTimeLists(); 
    }
  },
  // 滚动加载
  lower: function () {
    console.log(this.data.page, this.data.pageCount);
    if (!this.data.loadingStatus && this.data.page < this.data.pageCount) {
      this.data.page++;
      this.setData({
        loadingStatus: true,
        page: this.data.page
      });
      this.getTimeLists();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
  //  _this.getTimeLists(0);
  },
  getTimeLists: function () {
    // 列表数据接口
    let _this = this;
    api.getTimeList({
      name: this.data.searchValue,
      page: _this.data.page,
      pagesize: 10
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          pageCount: res.data.data.page_count,
          loadingStatus: false
        });
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